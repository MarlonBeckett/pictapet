import { genai } from "./gemini";

interface ReferenceImage {
  data: string;
  mimeType: string;
}

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000;

function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    // Retry on rate limits, server errors, network errors
    if (msg.includes("429") || msg.includes("rate limit")) return true;
    if (msg.includes("500") || msg.includes("503") || msg.includes("internal")) return true;
    if (msg.includes("network") || msg.includes("timeout") || msg.includes("econnreset") || msg.includes("fetch failed")) return true;
    // Do NOT retry on 400 (bad request) or auth errors
    if (msg.includes("400") || msg.includes("401") || msg.includes("403") || msg.includes("invalid")) return false;
  }
  return true; // Default to retryable for unknown errors
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateImage(
  prompt: string,
  referenceImage?: ReferenceImage
): Promise<Buffer> {
  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

  // Place reference image BEFORE text so the model sees the pet first
  if (referenceImage) {
    parts.push({
      inlineData: {
        mimeType: referenceImage.mimeType,
        data: referenceImage.data,
      },
    });
  }

  parts.push({ text: prompt });

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await genai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: [
          {
            role: "user",
            parts,
          },
        ],
        config: {
          responseModalities: ["IMAGE", "TEXT"],
        },
      });

      // Extract image from response
      const responseParts = response.candidates?.[0]?.content?.parts;
      if (!responseParts) {
        throw new Error("No response parts from image generation");
      }

      for (const part of responseParts) {
        if (part.inlineData?.data) {
          return Buffer.from(part.inlineData.data, "base64");
        }
      }

      throw new Error("No image data in generation response");
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES && isRetryableError(error)) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        console.log(`[image-gen] Attempt ${attempt}/${MAX_RETRIES} failed, retrying in ${delay}ms:`, error instanceof Error ? error.message : error);
        await sleep(delay);
      } else {
        break;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Image generation failed after retries");
}
