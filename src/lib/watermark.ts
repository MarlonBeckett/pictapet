import sharp from "sharp";
import path from "path";
import fs from "fs";

const assetsDir = path.join(process.cwd(), "src", "assets");

// Cache tile buffers in memory
let smallTile: Buffer | null = null;
let largeTile: Buffer | null = null;
let badge: Buffer | null = null;

function loadTiles() {
  if (!smallTile) {
    smallTile = fs.readFileSync(path.join(assetsDir, "watermark-tile-small.png"));
    largeTile = fs.readFileSync(path.join(assetsDir, "watermark-tile-large.png"));
    badge = fs.readFileSync(path.join(assetsDir, "watermark-badge.png"));
  }
}

export async function applyWatermark(imageBuffer: Buffer): Promise<Buffer> {
  loadTiles();
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();
  const width = metadata.width || 1024;
  const height = metadata.height || 1024;

  // Diagonal lines SVG — geometry only, no text/fonts, renders identically everywhere
  const linesSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <pattern id="wm3" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="20" x2="40" y2="20" stroke="white" stroke-width="0.5" opacity="0.08" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wm3)" />
    </svg>`;

  return image
    .composite([
      { input: smallTile!, tile: true },
      { input: largeTile!, tile: true },
      { input: Buffer.from(linesSvg), top: 0, left: 0 },
      { input: badge!, gravity: "centre" },
    ])
    .png()
    .toBuffer();
}
