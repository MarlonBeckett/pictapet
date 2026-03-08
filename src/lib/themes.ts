import { StyleTheme, SubRole } from "@/types";

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
  // AI prompt template (default, used when no sub-role selected)
  promptTemplate: string;
  // Sub-roles
  subRoles: SubRole[];
  subRolePrompts: Record<string, string>;
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
      "A rugged portrait of a {species} ({breed}) with {coloring} {furTexture} fur, {bodyProportions} build, {faceShape} face, {earDetails} ears, {eyeDetails} eyes, and {noseDetails} nose. The animal is sitting upright on its haunches on dusty desert ground, facing the viewer in a vertical portrait composition framed from chest level up. Dressed as a cowboy wearing a weathered brown leather cowboy hat, a red bandana tied around the neck, a fringed leather vest over a plaid shirt, and a sheriff's badge pinned to the vest. The pet has {expression} and {distinguishingFeatures}. Wild West desert landscape background with saguaro cacti, red rock mesas, and a warm golden sunset sky. Classical western oil painting style with visible brushstrokes, rich warm dusty golden light, and painterly textures.",
    subRoles: [
      { id: "cowboy", name: "Cowboy", emoji: "🤠", description: "Classic frontier wrangler", generateButton: "Yeehaw! Generate" },
      { id: "sheriff", name: "Sheriff", emoji: "⭐", description: "Law of the land", generateButton: "Lay Down the Law!" },
      { id: "outlaw", name: "Outlaw", emoji: "🏴‍☠️", description: "Wanted dead or alive", generateButton: "Wanted: Generate!" },
      { id: "saloon-owner", name: "Saloon Owner", emoji: "🥃", description: "Keeper of the bar", generateButton: "Pour One Out!" },
    ],
    subRolePrompts: {
      cowboy:
        "A rugged portrait of a {species} ({breed}) with {coloring} {furTexture} fur, {bodyProportions} build, {faceShape} face, {earDetails} ears, {eyeDetails} eyes, and {noseDetails} nose. The animal is sitting upright on its haunches on dusty desert ground, facing the viewer in a vertical portrait composition framed from chest level up. Dressed as a cowboy wearing a weathered brown leather cowboy hat, a red bandana tied around the neck, a fringed leather vest over a plaid shirt, and a sheriff's badge pinned to the vest. The pet has {expression} and {distinguishingFeatures}. Wild West desert landscape background with saguaro cacti, red rock mesas, and a warm golden sunset sky. Classical western oil painting style with visible brushstrokes, rich warm dusty golden light, and painterly textures.",
      sheriff:
        "A commanding portrait of a {species} ({breed}) with {coloring} {furTexture} fur, {bodyProportions} build, {faceShape} face, {earDetails} ears, {eyeDetails} eyes, and {noseDetails} nose. Dressed as a frontier sheriff wearing a polished silver sheriff star badge prominently on the chest, a long brown leather duster coat, a wide-brimmed hat, and a revolver holster on the hip. The pet has {expression} and {distinguishingFeatures}. Standing at the entrance of a dusty Old West town with wooden storefronts and a setting sun. Classical western oil painting style with visible brushstrokes, rich warm dusty golden light, and painterly textures.",
      outlaw:
        "A gritty portrait of a {species} ({breed}) with {coloring} {furTexture} fur, {bodyProportions} build, {faceShape} face, {earDetails} ears, {eyeDetails} eyes, and {noseDetails} nose. Dressed as a notorious outlaw with a dusty bandana mask pulled up around the neck, a battered wide-brim hat, a worn leather duster with bullet holes, rugged chaps, and a wanted poster partially visible behind them. The pet has {expression} and {distinguishingFeatures}. Rocky desert canyon hideout background with dramatic shadows and dusty golden light. Classical western oil painting style with visible brushstrokes, rich warm tones, and painterly textures.",
      "saloon-owner":
        "An elegant portrait of a {species} ({breed}) with {coloring} {furTexture} fur, {bodyProportions} build, {faceShape} face, {earDetails} ears, {eyeDetails} eyes, and {noseDetails} nose. Dressed as a refined saloon owner wearing a fancy embroidered vest with a silk back, a crisp bow tie, rolled-up white sleeves, and a gold pocket watch chain. The pet has {expression} and {distinguishingFeatures}. Warm saloon interior backdrop with polished wooden bar, hanging oil lamps, whiskey bottles, and card tables. Classical western oil painting style with visible brushstrokes, rich warm amber light, and painterly textures.",
    },
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
      heroSubtext: "Crown your pet as the royalty they truly are. Velvet robes, jeweled collars, and pampered elegance.",
      uploadLabel: "Present your noble subject",
      generateButton: "Crown Them",
      loadingSteps: ["Summoning the court painter", "Draping the royal robes", "Polishing the crown"],
      resultLabel: "By royal decree",
      resultHeading: "Long Live the Ruler",
    },
    promptTemplate:
      "A majestic portrait of a {species} ({breed}) with {coloring} {furTexture} fur, {bodyProportions} build, {faceShape} face, {earDetails} ears, {eyeDetails} eyes, and {noseDetails} nose. A pampered royal pet wearing a luxurious ermine-trimmed velvet robe in deep emerald green with gold leaf embroidery, an ornate jeweled collar with gemstones, perched elegantly on a plush embroidered cushion. The pet has {expression} and {distinguishingFeatures}. Soft golden countryside or palace garden visible in the background. Renaissance oil painting style, dramatic Rembrandt lighting, rich warm tones, detailed fabric textures, no frame or border around the image.",
    subRoles: [
      { id: "king", name: "King", emoji: "👑", description: "Ruler of the realm", generateButton: "Crown Them" },
      { id: "queen", name: "Queen", emoji: "👸", description: "Graceful sovereign", generateButton: "Crown Them" },
      { id: "knight", name: "Knight", emoji: "⚔️", description: "Sworn protector", generateButton: "Charge Forth!" },
      { id: "jester", name: "Jester", emoji: "🃏", description: "Court entertainer", generateButton: "Jest Away!" },
      { id: "blacksmith", name: "Blacksmith", emoji: "⚒️", description: "Master of the forge", generateButton: "Forge Ahead!" },
    ],
    subRolePrompts: {
      king:
        "A majestic portrait of a {species} ({breed}) with {coloring} {furTexture} fur, {bodyProportions} build, {faceShape} face, {earDetails} ears, {eyeDetails} eyes, and {noseDetails} nose. A pampered royal pet wearing a small ornate golden crown encrusted with rubies and sapphires, a luxurious crimson ermine-trimmed robe with gold embroidery draped over its body, and a heavy jeweled collar with a royal crest medallion, posed elegantly on a rich velvet cushion with gold tassels. The pet has {expression} and {distinguishingFeatures}. Lush palace garden with manicured hedges, marble columns, and soft golden afternoon light. Renaissance oil painting style, dramatic Rembrandt lighting, rich warm tones, detailed fabric textures, no frame or border around the image.",
      queen:
        "An elegant portrait of a {species} ({breed}) with {coloring} {furTexture} fur, {bodyProportions} build, {faceShape} face, {earDetails} ears, {eyeDetails} eyes, and {noseDetails} nose. A pampered royal pet wearing a delicate jeweled tiara with diamonds and pearls, an elegant flowing cape in royal purple and silver with lace trim draped over its body, and a dainty pearl necklace collar, resting gracefully on a silk-covered chaise with rose petals scattered nearby. The pet has {expression} and {distinguishingFeatures}. Lavish palace chamber with roses, silk curtains, and soft golden candlelight. Renaissance oil painting style, soft luminous lighting, rich warm tones, detailed fabric textures, no frame or border around the image.",
      knight:
        "An epic portrait of a {species} ({breed}) with {coloring} {furTexture} fur, {bodyProportions} build, {faceShape} face, {earDetails} ears, {eyeDetails} eyes, and {noseDetails} nose. A noble pampered pet wearing a small polished silver chest plate with intricate engravings draped over its body, a crimson cape flowing behind, and a chainmail collar, posed heroically with a gleaming sword resting beside it. The pet has {expression} and {distinguishingFeatures}. Medieval castle courtyard background with banners and dramatic sunset lighting. Renaissance oil painting style, heroic composition, rich warm tones, detailed metalwork textures, no frame or border around the image.",
      jester:
        "A whimsical portrait of a {species} ({breed}) with {coloring} {furTexture} fur, {bodyProportions} build, {faceShape} face, {earDetails} ears, {eyeDetails} eyes, and {noseDetails} nose. A playful pampered pet wearing a colorful motley cape in diamond patterns of red, gold, green, and purple draped over its body, a jingling three-pointed jester hat with bells on each tip, and a collar with tiny golden bells, sitting cheerfully on a patchwork velvet cushion. The pet has {expression} and {distinguishingFeatures}. Castle great hall background with checkered marble floors and warm candlelight. Renaissance oil painting style, warm cheerful lighting, vibrant colors, detailed fabric textures, no frame or border around the image.",
      blacksmith:
        "A powerful portrait of a {species} ({breed}) with {coloring} {furTexture} fur, {bodyProportions} build, {faceShape} face, {earDetails} ears, {eyeDetails} eyes, and {noseDetails} nose. A sturdy pampered pet wearing a small thick leather apron draped over its chest, a studded iron collar, posed beside a blazing forge with glowing orange-hot metal on a heavy iron anvil, tongs and hammers nearby. The pet has {expression} and {distinguishingFeatures}. Stone workshop interior with firelight, sparks, and hanging horseshoes. Renaissance oil painting style, dramatic forge lighting with orange and amber glow, rich warm tones, detailed textures, no frame or border around the image.",
    },
  },
  beach: {
    id: "beach",
    name: "Beach Day",
    tagline: "Sun, sand, and furry good vibes",
    emoji: "🏖️",
    colors: {
      bg: "#0c1e2e",
      bgAlt: "#132d40",
      border: "#1e4a66",
      text: "#f5f0e0",
      textMuted: "#7eb8d0",
      accent: "#f0a830",
      accentLight: "#f5c04a",
      error: "#e05050",
    },
    displayFont: "'Pacifico', cursive",
    copy: {
      heroLabel: "PictaPet Beach Day",
      heroHeading: 'Catch Some<br /><em>Waves</em>',
      heroSubtext: "Send your pet on the ultimate beach vacation. Surfboards, sunglasses, and sandy paws guaranteed.",
      uploadLabel: "Drop your beach buddy's photo here",
      generateButton: "Ride the Wave!",
      loadingSteps: ["Applying sunscreen", "Waxing the surfboard", "Finding the perfect wave"],
      resultLabel: "Fresh from the shore",
      resultHeading: "Life's a Beach",
    },
    promptTemplate:
      "A vibrant portrait of a {species} ({breed}) with {coloring} {furTexture} fur, {bodyProportions} build, {faceShape} face, {earDetails} ears, {eyeDetails} eyes, and {noseDetails} nose. The animal is on a sunny tropical beach, facing the viewer in a vertical portrait composition framed from chest level up. Wearing colorful Hawaiian board shorts and stylish sunglasses perched on the head, with a surfboard planted in the sand beside them. The pet has {expression} and {distinguishingFeatures}. Tropical beach background with turquoise ocean waves, white sand, palm trees, and a bright blue sky with puffy clouds. Bright, cheerful digital illustration style with warm golden sunlight, vivid tropical colors, and a fun vacation atmosphere.",
    subRoles: [
      { id: "surfer", name: "Surfer", emoji: "🏄", description: "Catching gnarly waves", generateButton: "Ride the Wave!" },
      { id: "lifeguard", name: "Lifeguard", emoji: "🛟", description: "Guardian of the shore", generateButton: "Save the Day!" },
      { id: "diver", name: "Scuba Diver", emoji: "🤿", description: "Deep sea explorer", generateButton: "Dive In!" },
      { id: "pirate", name: "Beach Pirate", emoji: "🏴‍☠️", description: "Treasure hunter of the coast", generateButton: "Plunder Away!" },
      { id: "hula-dancer", name: "Hula Dancer", emoji: "🌺", description: "Island rhythm master", generateButton: "Aloha! Generate" },
    ],
    subRolePrompts: {
      surfer:
        "A radical portrait of a {species} ({breed}) with {coloring} {furTexture} fur, {bodyProportions} build, {faceShape} face, {earDetails} ears, {eyeDetails} eyes, and {noseDetails} nose. Riding a colorful surfboard on a massive turquoise wave, wearing neon board shorts and a puka shell necklace, water spraying dramatically around them. The pet has {expression} and {distinguishingFeatures}. Tropical ocean background with a perfect barrel wave, bright blue sky, and golden sunlight glinting off the water. Bright, energetic digital illustration style with vivid tropical colors, dynamic motion, and warm golden light.",
      lifeguard:
        "A heroic portrait of a {species} ({breed}) with {coloring} {furTexture} fur, {bodyProportions} build, {faceShape} face, {earDetails} ears, {eyeDetails} eyes, and {noseDetails} nose. Dressed as a beach lifeguard sitting in a tall red lifeguard tower chair, wearing a red lifeguard swimsuit, aviator sunglasses, a whistle around the neck, and holding a red rescue buoy. The pet has {expression} and {distinguishingFeatures}. Panoramic beach background with gentle waves, white sand, colorful umbrellas, and a clear blue sky. Bright, cheerful digital illustration style with warm golden afternoon light and vivid coastal colors.",
      diver:
        "An adventurous portrait of a {species} ({breed}) with {coloring} {furTexture} fur, {bodyProportions} build, {faceShape} face, {earDetails} ears, {eyeDetails} eyes, and {noseDetails} nose. Wearing full scuba diving gear including a wetsuit, diving mask on the forehead, an oxygen tank on the back, and flippers, standing on a coral reef underwater surrounded by colorful tropical fish, sea turtles, and swaying anemones. The pet has {expression} and {distinguishingFeatures}. Vibrant underwater scene with sunbeams filtering through crystal-clear turquoise water and a sandy ocean floor. Bright, detailed digital illustration style with luminous aquatic blues and greens, dappled light rays, and vivid coral colors.",
      pirate:
        "A swashbuckling portrait of a {species} ({breed}) with {coloring} {furTexture} fur, {bodyProportions} build, {faceShape} face, {earDetails} ears, {eyeDetails} eyes, and {noseDetails} nose. Dressed as a tropical beach pirate wearing a tattered tricorn hat with a skull and crossbones, an open linen shirt, a leather baldric with a cutlass, an eye patch, and a treasure map tucked under one arm. The pet has {expression} and {distinguishingFeatures}. Sandy cove background with a beached pirate ship, palm trees, a treasure chest overflowing with gold coins, and a sunset sky in fiery orange and pink. Bright, adventurous digital illustration style with warm golden-hour light and rich tropical colors.",
      "hula-dancer":
        "A joyful portrait of a {species} ({breed}) with {coloring} {furTexture} fur, {bodyProportions} build, {faceShape} face, {earDetails} ears, {eyeDetails} eyes, and {noseDetails} nose. Dressed as a hula dancer wearing a green grass skirt, a colorful lei of plumeria and hibiscus flowers around the neck, a flower crown, and coconut shell accessories. The pet has {expression} and {distinguishingFeatures}. Lush Hawaiian beach backdrop with tiki torches, swaying palm trees, a gentle sunset, and soft ocean waves lapping the shore. Bright, festive digital illustration style with warm tropical sunset light, vivid floral colors, and a relaxed island atmosphere.",
    },
  },
};

export const THEME_LIST = Object.values(THEMES);

export function getTheme(themeId: string): SiteTheme | undefined {
  return THEMES[themeId as StyleTheme];
}
