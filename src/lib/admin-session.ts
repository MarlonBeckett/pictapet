import { PetAnalysis } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { Redis } from "@upstash/redis";

export interface AdminBatchImage {
  theme: string;
  subRole: string;
  imageUrl: string;
  originalPath: string;
}

export interface AdminBatchFailure {
  theme: string;
  subRole: string;
  error: string;
}

export interface AdminBatchSession {
  id: string;
  photoBase64: string;
  photoMimeType: string;
  petAnalysis: PetAnalysis;
  images: AdminBatchImage[];
  failures: AdminBatchFailure[];
  complete: boolean;
  createdAt: number;
}

const useRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

const redis = useRedis
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

const memoryStore = new Map<string, AdminBatchSession>();

const SESSION_TTL = 24 * 60 * 60; // 24 hours
const KEY_PREFIX = "admin-batch:";

function sessionKey(id: string): string {
  return `${KEY_PREFIX}${id}`;
}

// Per-session mutex to prevent concurrent read-modify-write races
const locks = new Map<string, Promise<void>>();

async function withLock<T>(id: string, fn: () => Promise<T>): Promise<T> {
  const key = sessionKey(id);
  // Wait for any existing lock on this session
  while (locks.has(key)) {
    await locks.get(key);
  }
  let resolve: () => void;
  const promise = new Promise<void>((r) => { resolve = r; });
  locks.set(key, promise);
  try {
    return await fn();
  } finally {
    locks.delete(key);
    resolve!();
  }
}

async function storeSet(id: string, session: AdminBatchSession): Promise<void> {
  if (redis) {
    await redis.set(sessionKey(id), JSON.stringify(session), { ex: SESSION_TTL });
  } else {
    memoryStore.set(id, session);
  }
}

async function storeGet(id: string): Promise<AdminBatchSession | undefined> {
  if (redis) {
    const data = await redis.get<string>(sessionKey(id));
    if (!data) return undefined;
    return typeof data === "string" ? JSON.parse(data) : (data as unknown as AdminBatchSession);
  } else {
    return memoryStore.get(id);
  }
}

export async function createAdminBatchSession(
  photoBase64: string,
  mimeType: string,
  petAnalysis: PetAnalysis
): Promise<AdminBatchSession> {
  const session: AdminBatchSession = {
    id: uuidv4(),
    photoBase64,
    photoMimeType: mimeType,
    petAnalysis,
    images: [],
    failures: [],
    complete: false,
    createdAt: Date.now(),
  };
  await storeSet(session.id, session);
  return session;
}

export async function getAdminBatchSession(id: string): Promise<AdminBatchSession | undefined> {
  return storeGet(id);
}

export async function addAdminBatchImage(
  id: string,
  image: AdminBatchImage
): Promise<void> {
  await withLock(id, async () => {
    const session = await storeGet(id);
    if (!session) return;
    session.images.push(image);
    await storeSet(id, session);
  });
}

export async function addAdminBatchFailure(
  id: string,
  failure: AdminBatchFailure
): Promise<void> {
  await withLock(id, async () => {
    const session = await storeGet(id);
    if (!session) return;
    session.failures.push(failure);
    await storeSet(id, session);
  });
}

export async function setAdminBatchComplete(id: string): Promise<void> {
  await withLock(id, async () => {
    const session = await storeGet(id);
    if (!session) return;
    session.complete = true;
    await storeSet(id, session);
  });
}

// Clean up old sessions from memory store (only relevant for local dev)
if (!useRedis) {
  setInterval(() => {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    for (const [id, session] of memoryStore) {
      if (session.createdAt < oneDayAgo) {
        memoryStore.delete(id);
      }
    }
  }, 60 * 60 * 1000);
}
