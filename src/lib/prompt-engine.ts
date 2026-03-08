import { StyleTheme, PetAnalysis } from "@/types";
import { THEMES } from "@/lib/themes";

export function buildPrompt(style: StyleTheme, analysis: PetAnalysis, subRole?: string): string {
  const theme = THEMES[style];
  if (!theme) throw new Error(`Unknown style: ${style}`);

  const template = subRole && theme.subRolePrompts[subRole]
    ? theme.subRolePrompts[subRole]
    : theme.promptTemplate;

  let prompt = template
    .replace(/\{species\}/g, analysis.species)
    .replace(/\{breed\}/g, analysis.breed)
    .replace(/\{coloring\}/g, analysis.coloring)
    .replace(/\{pose\}/g, analysis.pose)
    .replace(/\{expression\}/g, analysis.expression)
    .replace(/\{distinguishingFeatures\}/g, analysis.distinguishingFeatures)
    .replace(/\{faceShape\}/g, analysis.faceShape || "as shown in photo")
    .replace(/\{earDetails\}/g, analysis.earDetails || "as shown in photo")
    .replace(/\{eyeDetails\}/g, analysis.eyeDetails || "as shown in photo")
    .replace(/\{noseDetails\}/g, analysis.noseDetails || "as shown in photo")
    .replace(/\{bodyProportions\}/g, analysis.bodyProportions || "as shown in photo")
    .replace(/\{furTexture\}/g, analysis.furTexture || "as shown in photo")
    .replace(/\{tailDetails\}/g, analysis.tailDetails || "as shown in photo");

  // Species-aware pose instruction: large animals should never sit
  const standingAnimals = ["horse", "cow", "deer", "donkey", "mule", "llama", "alpaca", "goat", "sheep", "pig"];
  const isLargeAnimal = standingAnimals.some(a => analysis.species.toLowerCase().includes(a));

  const poseInstruction = isLargeAnimal
    ? "The animal must be standing upright on all four legs or lying down gracefully — NEVER sitting on its haunches."
    : "The animal must be posed naturally as an animal (sitting, standing, or lying on all fours) with costume elements draped, placed, or fitted onto its natural animal body.";

  // Add fidelity + style instruction block
  prompt +=
    " Use the reference photo ONLY to match this specific animal's face, coloring, markings, fur, and physical features exactly — do NOT substitute generic breed features. " +
    "CRITICAL: Completely IGNORE the background, setting, surface, furniture, bedding, and environment from the reference photo. Only extract the animal itself. Replace the entire environment with the theme-appropriate scene described in this prompt. " +
    "IMPORTANT STYLE RULES: Render as a classical oil painting portrait with visible brushstrokes, rich painted textures, and warm artistic lighting. NOT a photograph, NOT hyper-realistic, NOT a cartoon. " +
    poseInstruction + " " +
    "Do NOT pose the animal like a human sitting upright in a chair or standing on two legs. " +
    "Do NOT include any picture frame, border, or ornate frame around the image. " +
    "The image must be in 9:16 vertical portrait aspect ratio (taller than wide, like a mobile phone screen).";

  return prompt;
}
