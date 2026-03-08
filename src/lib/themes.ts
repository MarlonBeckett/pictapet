import { StyleTheme } from "@/types";

export interface SiteTheme {
  id: StyleTheme;
  // Gallery card
  name: string;
  tagline: string;
  emoji: string;
  // Colors (applied as CSS variables)
  colors: {
    bg: string;
    bgAlt: string;
    border: string;
    text: string;
    textMuted: string;
    accent: string;
    accentLight: string;
    error: string;
  };
  // Typography
  displayFont: string;
  // Copy
  copy: {
    heroLabel: string;
    heroHeading: string;
    heroSubtext: string;
    uploadLabel: string;
    generateButton: string;
    loadingSteps: [string, string, string];
    resultLabel: string;
    resultHeading: string;
  };
  // AI prompt template
  promptTemplate: string;
}

export const THEMES: Record<StyleTheme, SiteTheme> = {
  cowboy: {
    id: "cowboy",
    name: "Wild West",
    tagline: "Frontier legends, one portrait at a time",
    emoji: "🤠",
    colors: {
      bg: "#1f1710",
      bgAlt: "#2c2015",
      border: "#4a3828",
      text: "#f0e4d0",
      textMuted: "#a08b70",
      accent: "#c4713b",
      accentLight: "#d98c55",
      error: "#c45c4a",
    },
    displayFont: "'Rye', serif",
    copy: {
      heroLabel: "PictaPet Wild West",
      heroHeading: 'Saddle Up,<br /><em>Partner</em>',
      heroSubtext: "Turn your pet into a rugged frontier legend. Dusty trails, leather hats, and sheriff badges included.",
      uploadLabel: "Drop your outlaw's photo here",
      generateButton: "Yeehaw! Generate",
      loadingSteps: ["Scoutin' the trail", "Wranglin' the portrait", "Dustin' off the frame"],
      resultLabel: "Wanted: One good-lookin' critter",
      resultHeading: "A True Frontier Legend",
    },
    promptTemplate:
      "A rugged portrait of a {species} ({breed}) with {coloring} fur, dressed as a cowboy wearing a weathered brown leather cowboy hat, a bandana around the neck, a fringed leather vest over a plaid shirt, and a sheriff's badge. The pet has {expression} and {distinguishingFeatures}. Wild West desert landscape background with cacti and sunset, cinematic western movie style with warm dusty golden light.",
  },
  royal: {
    id: "royal",
    name: "Kingdom",
    tagline: "Regal portraits for noble beasts",
    emoji: "👑",
    colors: {
      bg: "#0f0e1a",
      bgAlt: "#1a1830",
      border: "#2e2b4a",
      text: "#f0ece0",
      textMuted: "#8a85a0",
      accent: "#c8a55c",
      accentLight: "#d4b978",
      error: "#c45c4a",
    },
    displayFont: "'Playfair Display', serif",
    copy: {
      heroLabel: "PictaPet Kingdom",
      heroHeading: 'Your Royal<br /><em>Highness</em>',
      heroSubtext: "Crown your pet as the royalty they truly are. Velvet robes, golden thrones, and jeweled crowns.",
      uploadLabel: "Present your noble subject",
      generateButton: "Crown Them",
      loadingSteps: ["Summoning the court painter", "Draping the royal robes", "Polishing the crown"],
      resultLabel: "By royal decree",
      resultHeading: "Long Live the Ruler",
    },
    promptTemplate:
      "A majestic portrait of a {species} ({breed}) with {coloring} fur, dressed as a royal king or queen wearing an ornate golden crown encrusted with jewels, a luxurious velvet ermine-trimmed robe in deep crimson and gold, seated on an elaborate golden throne. The pet has {expression} and {distinguishingFeatures}. Renaissance oil painting style, dramatic Rembrandt lighting, rich warm tones, detailed fabric textures, ornate gilded frame feeling.",
  },
  knight: {
    id: "knight",
    name: "Fortress",
    tagline: "Brave knights in shining armor",
    emoji: "⚔️",
    colors: {
      bg: "#14161a",
      bgAlt: "#1e2228",
      border: "#3a3e48",
      text: "#e8e6e0",
      textMuted: "#8a8d95",
      accent: "#7a9bb5",
      accentLight: "#99b5cc",
      error: "#c45c4a",
    },
    displayFont: "'MedievalSharp', cursive",
    copy: {
      heroLabel: "PictaPet Fortress",
      heroHeading: 'Rise,<br /><em>Noble Beast</em>',
      heroSubtext: "Forge your pet in steel and honor. Castle walls, gleaming swords, and billowing capes.",
      uploadLabel: "Present your squire",
      generateButton: "Forge the Portrait",
      loadingSteps: ["Heating the forge", "Hammering the armor", "Raising the banner"],
      resultLabel: "A knight to remember",
      resultHeading: "Hail the Champion",
    },
    promptTemplate:
      "An epic portrait of a {species} ({breed}) with {coloring} fur, dressed as a medieval knight wearing polished silver plate armor with intricate engravings, a crimson cape billowing behind, holding a gleaming sword. The pet has {expression} and {distinguishingFeatures}. Medieval castle courtyard background, dramatic sunset lighting, oil painting style with rich detail and heroic composition.",
  },
  astronaut: {
    id: "astronaut",
    name: "Mission Control",
    tagline: "Space explorers among the stars",
    emoji: "🚀",
    colors: {
      bg: "#0a0e18",
      bgAlt: "#121828",
      border: "#1e2a42",
      text: "#e0e8f5",
      textMuted: "#6880a0",
      accent: "#00c8e0",
      accentLight: "#40d8f0",
      error: "#e05050",
    },
    displayFont: "'Orbitron', sans-serif",
    copy: {
      heroLabel: "PictaPet Mission Control",
      heroHeading: 'Ready for<br /><em>Launch</em>',
      heroSubtext: "Send your pet to the stars. Space suits, nebulae, and zero gravity awaits.",
      uploadLabel: "Upload crew photo",
      generateButton: "Initiate Launch",
      loadingSteps: ["Running pre-flight checks", "Engaging thrusters", "Entering orbit"],
      resultLabel: "Transmission received",
      resultHeading: "Mission Accomplished",
    },
    promptTemplate:
      "A stunning portrait of a {species} ({breed}) with {coloring} fur, wearing a detailed NASA-style white space suit with a clear helmet visor, floating in space with Earth visible in the background, stars and nebulae surrounding them. The pet has {expression} and {distinguishingFeatures}. Photorealistic digital art style, dramatic space lighting with blue and purple hues, lens flare effects.",
  },
  superhero: {
    id: "superhero",
    name: "HQ",
    tagline: "Caped crusaders saving the day",
    emoji: "🦸",
    colors: {
      bg: "#12080e",
      bgAlt: "#1e1018",
      border: "#3a2030",
      text: "#f5e8e0",
      textMuted: "#a08088",
      accent: "#e83040",
      accentLight: "#f05060",
      error: "#ff6060",
    },
    displayFont: "'Bangers', cursive",
    copy: {
      heroLabel: "PictaPet HQ",
      heroHeading: 'Unleash<br /><em>the Hero</em>',
      heroSubtext: "Every pet has a superpower. Time to suit up, mask on, cape out.",
      uploadLabel: "Upload secret identity",
      generateButton: "Activate Powers",
      loadingSteps: ["Suiting up", "Calibrating superpowers", "Striking a pose"],
      resultLabel: "Hero identified",
      resultHeading: "A Hero Has Risen",
    },
    promptTemplate:
      "A dynamic portrait of a {species} ({breed}) with {coloring} fur, dressed as a superhero wearing a sleek custom-fitted suit in bold blue and red colors, a flowing cape, and a mask. The pet has {expression} and {distinguishingFeatures}. Standing heroically on a rooftop with a city skyline at sunset behind them. Comic book art style with vibrant colors, dynamic pose, dramatic lighting.",
  },
  chef: {
    id: "chef",
    name: "Kitchen",
    tagline: "Master chefs with impeccable taste",
    emoji: "👨‍🍳",
    colors: {
      bg: "#18140e",
      bgAlt: "#241e15",
      border: "#3e3528",
      text: "#f5efe5",
      textMuted: "#a09580",
      accent: "#c07040",
      accentLight: "#d48858",
      error: "#c45c4a",
    },
    displayFont: "'Playfair Display', serif",
    copy: {
      heroLabel: "PictaPet Kitchen",
      heroHeading: 'Bon<br /><em>Appétit</em>',
      heroSubtext: "Your pet, the master chef. White coats, copper pans, and Michelin-star ambitions.",
      uploadLabel: "Introduce the chef",
      generateButton: "Start Cooking",
      loadingSteps: ["Prepping ingredients", "Plating the masterpiece", "Adding the garnish"],
      resultLabel: "Chef's special",
      resultHeading: "A Culinary Masterpiece",
    },
    promptTemplate:
      "A charming portrait of a {species} ({breed}) with {coloring} fur, dressed as a master chef wearing a pristine white chef's coat with double-breasted buttons, a tall traditional toque blanche chef hat, holding a gleaming copper pan. The pet has {expression} and {distinguishingFeatures}. Professional restaurant kitchen background with warm lighting, appetizing food elements, photorealistic style with warm golden tones.",
  },
  rockstar: {
    id: "rockstar",
    name: "Backstage",
    tagline: "Rock legends, louder than ever",
    emoji: "🎸",
    colors: {
      bg: "#0e0a10",
      bgAlt: "#1a1020",
      border: "#30203a",
      text: "#f0e8f5",
      textMuted: "#8870a0",
      accent: "#e040a0",
      accentLight: "#f060b8",
      error: "#ff5050",
    },
    displayFont: "'Permanent Marker', cursive",
    copy: {
      heroLabel: "PictaPet Backstage",
      heroHeading: 'Born to<br /><em>Be Wild</em>',
      heroSubtext: "Your pet shreds harder than you. Leather jackets, stage lights, and sold-out shows.",
      uploadLabel: "Upload your rockstar",
      generateButton: "Crank It Up",
      loadingSteps: ["Tuning the guitar", "Testing the amps", "Dropping the curtain"],
      resultLabel: "Encore! Encore!",
      resultHeading: "A Legend Is Born",
    },
    promptTemplate:
      "An electrifying portrait of a {species} ({breed}) with {coloring} fur, dressed as a rock star wearing a studded black leather jacket, aviator sunglasses, and a bandana, shredding on an electric guitar. The pet has {expression} and {distinguishingFeatures}. Concert stage background with dramatic purple and red spotlights, smoke machines, and an energetic crowd. High-energy rock concert photography style with motion blur effects.",
  },
  wizard: {
    id: "wizard",
    name: "Academy",
    tagline: "Ancient magic, mystical portraits",
    emoji: "🧙",
    colors: {
      bg: "#0c0e18",
      bgAlt: "#141828",
      border: "#222840",
      text: "#e0e0f0",
      textMuted: "#7078a0",
      accent: "#8850d8",
      accentLight: "#a070f0",
      error: "#e05050",
    },
    displayFont: "'Cinzel Decorative', cursive",
    copy: {
      heroLabel: "PictaPet Academy",
      heroHeading: 'The Magic<br /><em>Awaits</em>',
      heroSubtext: "Your pet wields ancient power. Glowing staffs, mystical robes, and floating spellbooks.",
      uploadLabel: "Summon your familiar",
      generateButton: "Cast the Spell",
      loadingSteps: ["Gathering arcane energy", "Weaving the enchantment", "Binding the spell"],
      resultLabel: "The prophecy fulfilled",
      resultHeading: "A Sorcerer Supreme",
    },
    promptTemplate:
      "A mystical portrait of a {species} ({breed}) with {coloring} fur, dressed as a powerful wizard wearing flowing midnight blue robes covered in glowing silver star and moon patterns, a tall pointed wizard hat, holding a gnarled wooden staff with a glowing crystal on top. The pet has {expression} and {distinguishingFeatures}. Ancient magical library background with floating books and glowing runes, fantasy art style with ethereal blue and purple magical lighting.",
  },
};

export const THEME_LIST = Object.values(THEMES);

export function getTheme(themeId: string): SiteTheme | undefined {
  return THEMES[themeId as StyleTheme];
}
