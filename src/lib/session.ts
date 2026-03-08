import { GenerationSession, SessionStatus, StyleTheme, PetAnalysis } from "@/types";
import { v4 as uuidv4 } from "uuid";

const sessions = new Map<string, GenerationSession>();

export function createSession(style: StyleTheme, subRole?: string): GenerationSession {
  const session: GenerationSession = {
    id: uuidv4(),
    status: "analyzing",
    style,
    subRole,
    imageUrls: [],
    originalImagePaths: [],
    purchasedIndices: [],
    stripeSessionIds: [],
    createdAt: Date.now(),
  };
  sessions.set(session.id, session);
  return session;
}

export function getSession(id: string): GenerationSession | undefined {
  return sessions.get(id);
}

export function updateSession(
  id: string,
  updates: Partial<Pick<GenerationSession, "status" | "petAnalysis" | "imageUrls" | "purchasedIndices" | "generatingMore" | "originalPhotoBase64" | "originalPhotoMimeType" | "error">>
): void {
  const session = sessions.get(id);
  if (session) {
    Object.assign(session, updates);
  }
}

export function addImageToSession(id: string, imageUrl: string): void {
  const session = sessions.get(id);
  if (session) {
    session.imageUrls.push(imageUrl);
    session.generatingMore = false;
  }
}

export function addImageAndOriginalToSession(
  id: string,
  imageUrl: string,
  originalPath: string
): void {
  const session = sessions.get(id);
  if (session) {
    session.imageUrls.push(imageUrl);
    session.originalImagePaths.push(originalPath);
    session.generatingMore = false;
  }
}

export function markImagesPurchased(id: string, indices: number[], stripeSessionId: string): void {
  const session = sessions.get(id);
  if (session) {
    const existing = new Set(session.purchasedIndices);
    for (const idx of indices) {
      existing.add(idx);
    }
    session.purchasedIndices = Array.from(existing);
    session.stripeSessionIds.push(stripeSessionId);
  }
}

export function isImagePurchased(id: string, index: number): boolean {
  const session = sessions.get(id);
  return session?.purchasedIndices.includes(index) ?? false;
}

export function setSessionStatus(id: string, status: SessionStatus): void {
  updateSession(id, { status });
}

export function setSessionError(id: string, error: string): void {
  updateSession(id, { status: "error", error });
}

// Clean up old sessions (older than 1 hour)
setInterval(() => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [id, session] of sessions) {
    if (session.createdAt < oneHourAgo) {
      sessions.delete(id);
    }
  }
}, 10 * 60 * 1000);
