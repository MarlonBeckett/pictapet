import sharp from "sharp";

export async function applyWatermark(imageBuffer: Buffer): Promise<Buffer> {
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();
  const width = metadata.width || 1024;
  const height = metadata.height || 1024;

  // Dense, multi-layer watermark that's impossible to crop or screenshot around
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <!-- Dense small text grid -->
        <pattern id="wm1" width="80" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
          <text x="5" y="20" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" opacity="0.45">PictaPet</text>
          <text x="45" y="50" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white" opacity="0.3">PREVIEW</text>
        </pattern>
        <!-- Large text layer at different angle -->
        <pattern id="wm2" width="200" height="160" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
          <text x="10" y="80" font-family="Arial, sans-serif" font-size="32" font-weight="900" fill="white" opacity="0.15">PictaPet</text>
          <text x="60" y="140" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" opacity="0.12">SAMPLE</text>
        </pattern>
        <!-- Diagonal lines for texture -->
        <pattern id="wm3" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="20" x2="40" y2="20" stroke="white" stroke-width="0.5" opacity="0.08" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wm1)" />
      <rect width="100%" height="100%" fill="url(#wm2)" />
      <rect width="100%" height="100%" fill="url(#wm3)" />
      <!-- Center badge -->
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="48" font-weight="900" fill="white" opacity="0.2" transform="rotate(-25, ${width / 2}, ${height / 2})">PictaPet PREVIEW</text>
    </svg>
  `;

  const watermarkBuffer = Buffer.from(svg);

  return image
    .composite([{ input: watermarkBuffer, top: 0, left: 0 }])
    .png()
    .toBuffer();
}
