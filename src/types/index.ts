export type StyleTheme =
  | "royal"
  | "knight"
  | "astronaut"
  | "superhero"
  | "chef"
  | "cowboy"
  | "rockstar"
  | "wizard";

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
}

export type SessionStatus = "analyzing" | "generating" | "ready" | "error";

export interface GenerationSession {
  id: string;
  status: SessionStatus;
  style: StyleTheme;
  petAnalysis?: PetAnalysis;
  imageUrls: string[];
  generatingMore?: boolean;
  error?: string;
  createdAt: number;
}
