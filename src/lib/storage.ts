import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { applyWatermark } from "./watermark";
import { Redis } from "@upstash/redis";

const PORTRAIT_WIDTH = 1080;
const PORTRAIT_HEIGHT = 1920;
const IMAGE_TTL = 60 * 60; // 1 hour

// Use Redis for image storage in production, filesystem locally
const useRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

const redis = useRedis
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// Local filesystem paths (dev only)
const GENERATED_DIR = path.join(process.cwd(), "public", "generated");
const ORIGINALS_DIR = path.join(process.cwd(), "storage", "originals");

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export async function saveGeneratedImage(
  sessionId: string,
  imageBuffer: Buffer,
  index: number = 0
): Promise<{ watermarkedUrl: string; originalPath: string }> {
  const filename = `${sessionId}-${index}.png`;

  // Resize to 9:16 portrait aspect ratio
  const resizedBuffer = await sharp(imageBuffer)
    .resize(PORTRAIT_WIDTH, PORTRAIT_HEIGHT, { fit: "cover" })
    .png()
    .toBuffer();

  // Apply watermark
  const watermarkedBuffer = await applyWatermark(resizedBuffer);

  if (redis) {
    // Store both images as base64 in Redis
    const watermarkedKey = `img:watermarked:${filename}`;
    const originalKey = `img:original:${filename}`;

    await Promise.all([
      redis.set(watermarkedKey, watermarkedBuffer.toString("base64"), { ex: IMAGE_TTL }),
      redis.set(originalKey, resizedBuffer.toString("base64"), { ex: IMAGE_TTL }),
    ]);

    return {
      watermarkedUrl: `/api/image/${filename}`,
      originalPath: filename, // Just the filename, not a real path
    };
  } else {
    // Local dev: write to filesystem
    await ensureDir(GENERATED_DIR);
    await ensureDir(ORIGINALS_DIR);

    const originalPath = path.join(ORIGINALS_DIR, filename);
    await fs.writeFile(originalPath, resizedBuffer);

    const watermarkedPath = path.join(GENERATED_DIR, filename);
    await fs.writeFile(watermarkedPath, watermarkedBuffer);

    return {
      watermarkedUrl: `/generated/${filename}`,
      originalPath,
    };
  }
}

export async function getOriginalImage(
  sessionId: string,
  index: number
): Promise<Buffer | null> {
  const filename = `${sessionId}-${index}.png`;

  if (redis) {
    const data = await redis.get<string>(`img:original:${filename}`);
    if (!data) return null;
    return Buffer.from(data, "base64");
  } else {
    const filepath = path.join(ORIGINALS_DIR, filename);
    try {
      return await fs.readFile(filepath);
    } catch {
      return null;
    }
  }
}

export async function getWatermarkedImage(
  filename: string
): Promise<Buffer | null> {
  if (redis) {
    const data = await redis.get<string>(`img:watermarked:${filename}`);
    if (!data) return null;
    return Buffer.from(data, "base64");
  }
  return null;
}
