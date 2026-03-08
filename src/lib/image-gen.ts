import { genai } from "./gemini";

export async function generateImage(prompt: string): Promise<Buffer> {
  const response = await genai.models.generateContent({
    model: "gemini-2.0-flash-exp-image-generation",
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    config: {
      responseModalities: ["IMAGE", "TEXT"],
    },
  });

  // Extract image from response
  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) {
    throw new Error("No response parts from image generation");
  }

  for (const part of parts) {
    if (part.inlineData?.data) {
      return Buffer.from(part.inlineData.data, "base64");
    }
  }

  throw new Error("No image data in generation response");
}
