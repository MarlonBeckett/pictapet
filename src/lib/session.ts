import { GenerationSession, SessionStatus, StyleTheme } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const SESSION_TTL = 60 * 60; // 1 hour in seconds
const KEY_PREFIX = "session:";

function sessionKey(id: string): string {
  return `${KEY_PREFIX}${id}`;
}

export async function createSession(style: StyleTheme, subRole?: string): Promise<GenerationSession> {
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
  await redis.set(sessionKey(session.id), JSON.stringify(session), { ex: SESSION_TTL });
  return session;
}

export async function getSession(id: string): Promise<GenerationSession | undefined> {
  const data = await redis.get<string>(sessionKey(id));
  if (!data) return undefined;
  return typeof data === "string" ? JSON.parse(data) : data as unknown as GenerationSession;
}

export async function updateSession(
  id: string,
  updates: Partial<GenerationSession>
): Promise<void> {
  const session = await getSession(id);
  if (!session) return;
  const updated = { ...session, ...updates };
  await redis.set(sessionKey(id), JSON.stringify(updated), { ex: SESSION_TTL });
}

export async function addImageAndOriginalToSession(
  id: string,
  imageUrl: string,
  originalPath: string
): Promise<void> {
  const session = await getSession(id);
  if (!session) return;
  session.imageUrls.push(imageUrl);
  session.originalImagePaths.push(originalPath);
  session.generatingMore = false;
  await redis.set(sessionKey(id), JSON.stringify(session), { ex: SESSION_TTL });
}

export async function markImagesPurchased(id: string, indices: number[], stripeSessionId: string): Promise<void> {
  const session = await getSession(id);
  if (!session) return;
  const existing = new Set(session.purchasedIndices);
  for (const idx of indices) {
    existing.add(idx);
  }
  session.purchasedIndices = Array.from(existing);
  session.stripeSessionIds.push(stripeSessionId);
  await redis.set(sessionKey(id), JSON.stringify(session), { ex: SESSION_TTL });
}

export async function isImagePurchased(id: string, index: number): Promise<boolean> {
  const session = await getSession(id);
  return session?.purchasedIndices.includes(index) ?? false;
}

export async function setSessionStatus(id: string, status: SessionStatus): Promise<void> {
  await updateSession(id, { status });
}

export async function setSessionError(id: string, error: string): Promise<void> {
  await updateSession(id, { status: "error", error });
}
