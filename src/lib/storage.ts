import fs from "fs/promises";
import path from "path";

const GENERATED_DIR = path.join(process.cwd(), "public", "generated");

async function ensureDir() {
  await fs.mkdir(GENERATED_DIR, { recursive: true });
}

export async function saveGeneratedImage(
  sessionId: string,
  imageBuffer: Buffer
): Promise<string> {
  await ensureDir();

  const filename = `${sessionId}.png`;
  const filepath = path.join(GENERATED_DIR, filename);

  await fs.writeFile(filepath, imageBuffer);

  return `/generated/${filename}`;
}
