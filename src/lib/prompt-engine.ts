import { StyleTheme, StyleThemeConfig, PetAnalysis } from "@/types";

export const STYLE_THEMES: StyleThemeConfig[] = [
  {
    id: "royal",
    name: "Royal King/Queen",
    description: "Majestic royalty in regal attire",
    emoji: "👑",
    promptTemplate:
      "A majestic portrait of a {species} ({breed}) with {coloring} fur, dressed as a royal king or queen wearing an ornate golden crown encrusted with jewels, a luxurious velvet ermine-trimmed robe in deep crimson and gold, seated on an elaborate golden throne. The pet has {expression} and {distinguishingFeatures}. Renaissance oil painting style, dramatic Rembrandt lighting, rich warm tones, detailed fabric textures, ornate gilded frame feeling.",
  },
  {
    id: "knight",
    name: "Medieval Knight",
    description: "Brave knight in shining armor",
    emoji: "⚔️",
    promptTemplate:
      "An epic portrait of a {species} ({breed}) with {coloring} fur, dressed as a medieval knight wearing polished silver plate armor with intricate engravings, a crimson cape billowing behind, holding a gleaming sword. The pet has {expression} and {distinguishingFeatures}. Medieval castle courtyard background, dramatic sunset lighting, oil painting style with rich detail and heroic composition.",
  },
  {
    id: "astronaut",
    name: "Astronaut",
    description: "Space explorer among the stars",
    emoji: "🚀",
    promptTemplate:
      "A stunning portrait of a {species} ({breed}) with {coloring} fur, wearing a detailed NASA-style white space suit with a clear helmet visor, floating in space with Earth visible in the background, stars and nebulae surrounding them. The pet has {expression} and {distinguishingFeatures}. Photorealistic digital art style, dramatic space lighting with blue and purple hues, lens flare effects.",
  },
  {
    id: "superhero",
    name: "Superhero",
    description: "Caped crusader saving the day",
    emoji: "🦸",
    promptTemplate:
      "A dynamic portrait of a {species} ({breed}) with {coloring} fur, dressed as a superhero wearing a sleek custom-fitted suit in bold blue and red colors, a flowing cape, and a mask. The pet has {expression} and {distinguishingFeatures}. Standing heroically on a rooftop with a city skyline at sunset behind them. Comic book art style with vibrant colors, dynamic pose, dramatic lighting.",
  },
  {
    id: "chef",
    name: "Chef",
    description: "Master chef in the kitchen",
    emoji: "👨‍🍳",
    promptTemplate:
      "A charming portrait of a {species} ({breed}) with {coloring} fur, dressed as a master chef wearing a pristine white chef's coat with double-breasted buttons, a tall traditional toque blanche chef hat, holding a gleaming copper pan. The pet has {expression} and {distinguishingFeatures}. Professional restaurant kitchen background with warm lighting, appetizing food elements, photorealistic style with warm golden tones.",
  },
  {
    id: "cowboy",
    name: "Cowboy",
    description: "Wild West frontier legend",
    emoji: "🤠",
    promptTemplate:
      "A rugged portrait of a {species} ({breed}) with {coloring} fur, dressed as a cowboy wearing a weathered brown leather cowboy hat, a bandana around the neck, a fringed leather vest over a plaid shirt, and a sheriff's badge. The pet has {expression} and {distinguishingFeatures}. Wild West desert landscape background with cacti and sunset, cinematic western movie style with warm dusty golden light.",
  },
  {
    id: "rockstar",
    name: "Rockstar",
    description: "Rock and roll legend on stage",
    emoji: "🎸",
    promptTemplate:
      "An electrifying portrait of a {species} ({breed}) with {coloring} fur, dressed as a rock star wearing a studded black leather jacket, aviator sunglasses, and a bandana, shredding on an electric guitar. The pet has {expression} and {distinguishingFeatures}. Concert stage background with dramatic purple and red spotlights, smoke machines, and an energetic crowd. High-energy rock concert photography style with motion blur effects.",
  },
  {
    id: "wizard",
    name: "Wizard/Sorcerer",
    description: "Mystical spellcaster of ancient power",
    emoji: "🧙",
    promptTemplate:
      "A mystical portrait of a {species} ({breed}) with {coloring} fur, dressed as a powerful wizard wearing flowing midnight blue robes covered in glowing silver star and moon patterns, a tall pointed wizard hat, holding a gnarled wooden staff with a glowing crystal on top. The pet has {expression} and {distinguishingFeatures}. Ancient magical library background with floating books and glowing runes, fantasy art style with ethereal blue and purple magical lighting.",
  },
];

export function getStyleConfig(styleId: StyleTheme): StyleThemeConfig {
  const config = STYLE_THEMES.find((s) => s.id === styleId);
  if (!config) throw new Error(`Unknown style: ${styleId}`);
  return config;
}

export function buildPrompt(style: StyleTheme, analysis: PetAnalysis): string {
  const config = getStyleConfig(style);

  let prompt = config.promptTemplate
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
