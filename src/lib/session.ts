import { GenerationSession, SessionStatus, StyleTheme } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { Redis } from "@upstash/redis";

// Use Redis in production, in-memory Map for local dev
const useRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

const redis = useRedis
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

const memoryStore = new Map<string, GenerationSession>();

const SESSION_TTL = 60 * 60; // 1 hour in seconds
const KEY_PREFIX = "session:";

function sessionKey(id: string): string {
  return `${KEY_PREFIX}${id}`;
}

async function storeSet(id: string, session: GenerationSession): Promise<void> {
  if (redis) {
    await redis.set(sessionKey(id), JSON.stringify(session), { ex: SESSION_TTL });
  } else {
    memoryStore.set(id, session);
  }
}

async function storeGet(id: string): Promise<GenerationSession | undefined> {
  if (redis) {
    const data = await redis.get<string>(sessionKey(id));
    if (!data) return undefined;
    return typeof data === "string" ? JSON.parse(data) : data as unknown as GenerationSession;
  } else {
    return memoryStore.get(id);
  }
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
  await storeSet(session.id, session);
  return session;
}

export async function getSession(id: string): Promise<GenerationSession | undefined> {
  return storeGet(id);
}

export async function updateSession(
  id: string,
  updates: Partial<GenerationSession>
): Promise<void> {
  const session = await storeGet(id);
  if (!session) return;
  const updated = { ...session, ...updates };
  await storeSet(id, updated);
}

export async function addImageAndOriginalToSession(
  id: string,
  imageUrl: string,
  originalPath: string
): Promise<void> {
  const session = await storeGet(id);
  if (!session) return;
  session.imageUrls.push(imageUrl);
  session.originalImagePaths.push(originalPath);
  session.generatingMore = false;
  await storeSet(id, session);
}

export async function markImagesPurchased(id: string, indices: number[], stripeSessionId: string): Promise<void> {
  const session = await storeGet(id);
  if (!session) return;
  const existing = new Set(session.purchasedIndices);
  for (const idx of indices) {
    existing.add(idx);
  }
  session.purchasedIndices = Array.from(existing);
  session.stripeSessionIds.push(stripeSessionId);
  await storeSet(id, session);
}

export async function isImagePurchased(id: string, index: number): Promise<boolean> {
  const session = await storeGet(id);
  return session?.purchasedIndices.includes(index) ?? false;
}

export async function setSessionStatus(id: string, status: SessionStatus): Promise<void> {
  await updateSession(id, { status });
}

export async function setSessionError(id: string, error: string): Promise<void> {
  await updateSession(id, { status: "error", error });
}

// Clean up old sessions from memory store (only relevant for local dev)
if (!useRedis) {
  setInterval(() => {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    for (const [id, session] of memoryStore) {
      if (session.createdAt < oneHourAgo) {
        memoryStore.delete(id);
      }
    }
  }, 10 * 60 * 1000);
}
