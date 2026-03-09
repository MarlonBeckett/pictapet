import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { Redis } from "@upstash/redis";

const PORTRAIT_WIDTH = 1080;
const PORTRAIT_HEIGHT = 1920;
const IMAGE_TTL = 24 * 60 * 60; // 24 hours

const useRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

const redis = useRedis
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

const ADMIN_DIR = path.join(process.cwd(), "storage", "admin");

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

function imageKey(batchId: string, theme: string, subRole: string): string {
  return `img:admin:${batchId}-${theme}-${subRole}.png`;
}

export async function saveAdminImage(
  batchId: string,
  theme: string,
  subRole: string,
  imageBuffer: Buffer
): Promise<string> {
  const resizedBuffer = await sharp(imageBuffer)
    .resize(PORTRAIT_WIDTH, PORTRAIT_HEIGHT, { fit: "cover" })
    .png()
    .toBuffer();

  const key = imageKey(batchId, theme, subRole);

  if (redis) {
    await redis.set(key, resizedBuffer.toString("base64"), { ex: IMAGE_TTL });
  } else {
    await ensureDir(ADMIN_DIR);
    const filename = `${batchId}-${theme}-${subRole}.png`;
    await fs.writeFile(path.join(ADMIN_DIR, filename), resizedBuffer);
  }

  return `/api/admin/image/${batchId}/${theme}/${subRole}`;
}

export async function getAdminImage(
  batchId: string,
  theme: string,
  subRole: string
): Promise<Buffer | null> {
  const key = imageKey(batchId, theme, subRole);

  if (redis) {
    const data = await redis.get<string>(key);
    if (!data) return null;
    return Buffer.from(data, "base64");
  } else {
    const filename = `${batchId}-${theme}-${subRole}.png`;
    const filepath = path.join(ADMIN_DIR, filename);
    try {
      return await fs.readFile(filepath);
    } catch {
      return null;
    }
  }
}
