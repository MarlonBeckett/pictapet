/**
 * Generate pre-rendered watermark tile PNGs.
 * Run locally where Arial is available: npx tsx scripts/generate-watermark-tiles.ts
 * Commit the output PNGs — they are used at runtime instead of SVG text rendering.
 */
import sharp from "sharp";
import path from "path";
import fs from "fs";

const outDir = path.join(__dirname, "..", "src", "assets");
fs.mkdirSync(outDir, { recursive: true });

async function generateSmallTile() {
  // Matches original: 80x60 pattern at -30deg with "PictaPet" + "PREVIEW"
  const tileW = 160;
  const tileH = 120;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${tileW}" height="${tileH}">
      <rect width="100%" height="100%" fill="transparent" />
      <g transform="rotate(-30, ${tileW / 2}, ${tileH / 2})">
        <text x="5" y="35" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" opacity="0.45">PictaPet</text>
        <text x="45" y="65" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white" opacity="0.3">PREVIEW</text>
        <text x="85" y="95" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" opacity="0.45">PictaPet</text>
        <text x="5" y="95" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white" opacity="0.3">PREVIEW</text>
        <text x="-35" y="65" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" opacity="0.45">PictaPet</text>
        <text x="125" y="35" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white" opacity="0.3">PREVIEW</text>
      </g>
    </svg>`;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(outDir, "watermark-tile-small.png"));
  console.log("Created watermark-tile-small.png");
}

async function generateLargeTile() {
  // Matches original: 200x160 pattern at 15deg with large "PictaPet" + "SAMPLE"
  const tileW = 400;
  const tileH = 320;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${tileW}" height="${tileH}">
      <rect width="100%" height="100%" fill="transparent" />
      <g transform="rotate(15, ${tileW / 2}, ${tileH / 2})">
        <text x="10" y="80" font-family="Arial, sans-serif" font-size="32" font-weight="900" fill="white" opacity="0.15">PictaPet</text>
        <text x="60" y="140" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" opacity="0.12">SAMPLE</text>
        <text x="210" y="240" font-family="Arial, sans-serif" font-size="32" font-weight="900" fill="white" opacity="0.15">PictaPet</text>
        <text x="260" y="300" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" opacity="0.12">SAMPLE</text>
        <text x="-40" y="240" font-family="Arial, sans-serif" font-size="32" font-weight="900" fill="white" opacity="0.15">PictaPet</text>
        <text x="10" y="300" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" opacity="0.12">SAMPLE</text>
      </g>
    </svg>`;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(outDir, "watermark-tile-large.png"));
  console.log("Created watermark-tile-large.png");
}

async function generateBadge() {
  // Center badge: "PictaPet PREVIEW" at -25deg, ~800x200
  const w = 800;
  const h = 200;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <rect width="100%" height="100%" fill="transparent" />
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
        font-family="Arial, sans-serif" font-size="48" font-weight="900"
        fill="white" opacity="0.2"
        transform="rotate(-25, ${w / 2}, ${h / 2})">PictaPet PREVIEW</text>
    </svg>`;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(outDir, "watermark-badge.png"));
  console.log("Created watermark-badge.png");
}

async function main() {
  await Promise.all([generateSmallTile(), generateLargeTile(), generateBadge()]);
  console.log("\nAll watermark tiles generated in src/assets/");
}

main().catch(console.error);
