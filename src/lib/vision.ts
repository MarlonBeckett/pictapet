import { genai } from "./gemini";
import { PetAnalysis } from "@/types";

export async function analyzePetPhoto(imageBuffer: Buffer, mimeType: string): Promise<PetAnalysis> {
  const base64Image = imageBuffer.toString("base64");

  const response = await genai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Image,
            },
          },
          {
            text: `Analyze this pet photo and return a JSON object with the following fields:
- species: the type of animal (e.g., "dog", "cat", "rabbit")
- breed: the breed or best guess (e.g., "Golden Retriever", "Siamese", "Mixed breed tabby")
- coloring: detailed description of fur/feather colors and patterns (e.g., "golden blonde with white chest patch")
- pose: the pet's body position (e.g., "sitting upright facing camera", "lying down with head tilted")
- expression: the pet's facial expression (e.g., "happy with tongue out", "alert with ears perked")
- distinguishingFeatures: any unique markings or features (e.g., "heterochromia - one blue eye one brown eye", "small scar on left ear")

Return ONLY valid JSON, no markdown formatting or code blocks.`,
          },
        ],
      },
    ],
  });

  const text = response.text?.trim() || "";

  // Strip markdown code blocks if present
  const jsonStr = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");

  try {
    const analysis = JSON.parse(jsonStr) as PetAnalysis;
    return analysis;
  } catch {
    throw new Error(`Failed to parse pet analysis: ${text}`);
  }
}
