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
            text: `Analyze this pet photo and return a JSON object with the following fields. Describe what you ACTUALLY SEE in the photo, not breed-typical traits. Be specific and detailed.

- species: the type of animal (e.g., "dog", "cat", "rabbit")
- breed: the breed or best guess (e.g., "Golden Retriever", "Siamese", "Mixed breed tabby")
- coloring: detailed description of fur/feather colors and patterns (e.g., "golden blonde with white chest patch")
- pose: the pet's body position (e.g., "sitting upright facing camera", "lying down with head tilted")
- expression: the pet's facial expression (e.g., "happy with tongue out", "alert with ears perked")
- distinguishingFeatures: any unique markings or features (e.g., "heterochromia - one blue eye one brown eye", "small scar on left ear")
- faceShape: the shape and structure of the face as seen in the photo (e.g., "round and flat with prominent cheeks", "long narrow snout with angular jawline")
- earDetails: exact appearance of the ears (e.g., "large upright triangular ears with tufted tips", "long floppy ears that hang past the jawline")
- eyeDetails: exact appearance of the eyes including color, shape, and size (e.g., "large round amber eyes with dark pupils", "small almond-shaped dark brown eyes")
- noseDetails: exact appearance of the nose (e.g., "small pink triangle nose", "large black rounded nose with wide nostrils")
- bodyProportions: the build and proportions of the body (e.g., "stocky and compact with short legs", "tall and slender with long legs")
- furTexture: the texture and length of the fur/coat (e.g., "short smooth glossy coat", "long fluffy double coat with feathering on legs")
- tailDetails: appearance of the tail if visible (e.g., "long bushy curved tail", "short stubby tail", "not visible in photo")

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
