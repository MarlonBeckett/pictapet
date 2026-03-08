import { genai } from "./gemini";

interface ReferenceImage {
  data: string;
  mimeType: string;
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
}
