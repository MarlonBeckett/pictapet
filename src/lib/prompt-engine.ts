import { StyleTheme, PetAnalysis } from "@/types";
import { THEMES } from "@/lib/themes";

export function buildPrompt(style: StyleTheme, analysis: PetAnalysis): string {
  const theme = THEMES[style];
  if (!theme) throw new Error(`Unknown style: ${style}`);

  let prompt = theme.promptTemplate
    .replace(/\{species\}/g, analysis.species)
    .replace(/\{breed\}/g, analysis.breed)
    .replace(/\{coloring\}/g, analysis.coloring)
    .replace(/\{pose\}/g, analysis.pose)
    .replace(/\{expression\}/g, analysis.expression)
    .replace(/\{distinguishingFeatures\}/g, analysis.distinguishingFeatures);

  // Add quality modifiers
  prompt +=
    " Ultra high quality, highly detailed, professional portrait photography composition, 4K resolution, sharp focus.";

  return prompt;
}
