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
    purchased: false,
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
  updates: Partial<Pick<GenerationSession, "status" | "petAnalysis" | "imageUrls" | "generatingMore" | "originalPhotoBase64" | "originalPhotoMimeType" | "error">>
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

export function markSessionPurchased(id: string, stripeSessionId: string): void {
  const session = sessions.get(id);
  if (session) {
    session.purchased = true;
    session.stripeSessionId = stripeSessionId;
  }
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
