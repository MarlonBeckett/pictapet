export type StyleTheme = "royal" | "cowboy" | "beach" | "portrait";

export interface StyleThemeConfig {
  id: StyleTheme;
  name: string;
  description: string;
  emoji: string;
  promptTemplate: string;
}

export interface PetAnalysis {
  species: string;
  breed: string;
  coloring: string;
  pose: string;
  expression: string;
  distinguishingFeatures: string;
  faceShape: string;
  earDetails: string;
  eyeDetails: string;
  noseDetails: string;
  bodyProportions: string;
  furTexture: string;
  tailDetails: string;
}

export type SessionStatus = "analyzing" | "generating" | "ready" | "error";

export interface SubRole {
  id: string;
  name: string;
  emoji: string;
  description: string;
  generateButton?: string;
}

export interface GenerationSession {
  id: string;
  status: SessionStatus;
  style: StyleTheme;
  subRole?: string;
  petAnalysis?: PetAnalysis;
  imageUrls: string[];
  originalImagePaths: string[];
  purchased: boolean;
  stripeSessionId?: string;
  generatingMore?: boolean;
  originalPhotoBase64?: string;
  originalPhotoMimeType?: string;
  error?: string;
  createdAt: number;
}
