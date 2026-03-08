import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { applyWatermark } from "./watermark";

const GENERATED_DIR = path.join(process.cwd(), "public", "generated");
const ORIGINALS_DIR = path.join(process.cwd(), "storage", "originals");

const PORTRAIT_WIDTH = 1080;
const PORTRAIT_HEIGHT = 1920;

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export async function saveGeneratedImage(
  sessionId: string,
  imageBuffer: Buffer,
  index: number = 0
): Promise<{ watermarkedUrl: string; originalPath: string }> {
  await ensureDir(GENERATED_DIR);
  await ensureDir(ORIGINALS_DIR);

  const filename = `${sessionId}-${index}.png`;

  // Resize to 9:16 portrait aspect ratio
  const resizedBuffer = await sharp(imageBuffer)
    .resize(PORTRAIT_WIDTH, PORTRAIT_HEIGHT, { fit: "cover" })
    .png()
    .toBuffer();

  // Save original to private storage
  const originalPath = path.join(ORIGINALS_DIR, filename);
  await fs.writeFile(originalPath, resizedBuffer);

  // Apply watermark and save to public dir
  const watermarkedBuffer = await applyWatermark(resizedBuffer);
  const watermarkedPath = path.join(GENERATED_DIR, filename);
  await fs.writeFile(watermarkedPath, watermarkedBuffer);

  return {
    watermarkedUrl: `/generated/${filename}`,
    originalPath,
  };
}

export async function getOriginalImage(
  sessionId: string,
  index: number
): Promise<Buffer | null> {
  const filename = `${sessionId}-${index}.png`;
  const filepath = path.join(ORIGINALS_DIR, filename);

  try {
    return await fs.readFile(filepath);
  } catch {
    return null;
  }
}
