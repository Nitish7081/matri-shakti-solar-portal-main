import fs from 'fs';
import path from 'path';

// 1. Generate SVG
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="solarGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBBF24" />
      <stop offset="50%" stop-color="#F97316" />
      <stop offset="100%" stop-color="#EA580C" />
    </linearGradient>
    <linearGradient id="coreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Base Rounded Squircle -->
  <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#solarGlow)" filter="url(#shadow)"/>

  <!-- Rotating Solar Rays (8 primary rays) -->
  <rect x="30" y="7" width="4" height="8" rx="2" fill="#FFFFFF" opacity="0.95"/>
  <rect x="30" y="49" width="4" height="8" rx="2" fill="#FFFFFF" opacity="0.95"/>
  <rect x="7" y="30" width="8" height="4" rx="2" fill="#FFFFFF" opacity="0.95"/>
  <rect x="49" y="30" width="8" height="4" rx="2" fill="#FFFFFF" opacity="0.95"/>

  <!-- Diagonal Rays -->
  <rect x="30" y="7" width="4" height="7" rx="2" fill="#FFFFFF" opacity="0.9" transform="rotate(45 32 32)"/>
  <rect x="30" y="50" width="4" height="7" rx="2" fill="#FFFFFF" opacity="0.9" transform="rotate(45 32 32)"/>
  <rect x="7" y="30" width="7" height="4" rx="2" fill="#FFFFFF" opacity="0.9" transform="rotate(45 32 32)"/>
  <rect x="50" y="30" width="7" height="4" rx="2" fill="#FFFFFF" opacity="0.9" transform="rotate(45 32 32)"/>

  <!-- Outer Ring -->
  <circle cx="32" cy="32" r="16" fill="none" stroke="#FFFFFF" stroke-width="2.5" opacity="0.9"/>

  <!-- Solar Core -->
  <circle cx="32" cy="32" r="12" fill="url(#coreGlow)"/>

  <!-- Solar Grid Accent -->
  <path d="M 24 32 L 40 32 M 32 24 L 32 40" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
  <circle cx="32" cy="32" r="4" fill="#FFFFFF"/>
</svg>`;

// 2. Generate standard 32x32 ICO file with DIB bitmap
function createIcoBuffer(size = 32) {
  const width = size;
  const height = size;
  const bpp = 32;
  const pixelCount = width * height;
  const imageSize = pixelCount * 4;
  const maskRowSize = Math.floor((width + 31) / 32) * 4;
  const maskSize = maskRowSize * height;
  const dibHeaderSize = 40;
  const dibSize = dibHeaderSize + imageSize + maskSize;

  // ICO header: 6 bytes
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // reserved
  icoHeader.writeUInt16LE(1, 2); // icon type
  icoHeader.writeUInt16LE(1, 4); // 1 image

  // Icon Directory Entry: 16 bytes
  const dirEntry = Buffer.alloc(16);
  dirEntry.writeUInt8(width === 256 ? 0 : width, 0);
  dirEntry.writeUInt8(height === 256 ? 0 : height, 1);
  dirEntry.writeUInt8(0, 2); // color count
  dirEntry.writeUInt8(0, 3); // reserved
  dirEntry.writeUInt16LE(1, 4); // color planes
  dirEntry.writeUInt16LE(bpp, 6); // bits per pixel
  dirEntry.writeUInt32LE(dibSize, 8); // size of image data
  dirEntry.writeUInt32LE(22, 12); // offset of image data (6 + 16 = 22)

  // DIB Header: 40 bytes
  const dibHeader = Buffer.alloc(dibHeaderSize);
  dibHeader.writeUInt32LE(dibHeaderSize, 0);
  dibHeader.writeInt32LE(width, 4);
  dibHeader.writeInt32LE(height * 2, 8); // height * 2 for icon (XOR + AND mask)
  dibHeader.writeUInt16LE(1, 12); // planes
  dibHeader.writeUInt16LE(bpp, 14); // bpp
  dibHeader.writeUInt32LE(0, 16); // BI_RGB (uncompressed)
  dibHeader.writeUInt32LE(imageSize + maskSize, 20);
  dibHeader.writeInt32LE(0, 24);
  dibHeader.writeInt32LE(0, 28);
  dibHeader.writeUInt32LE(0, 32);
  dibHeader.writeUInt32LE(0, 36);

  // Pixels Buffer (Bottom to Top)
  const pixels = Buffer.alloc(imageSize);
  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  const radius = 13.5;

  for (let y = 0; y < height; y++) {
    // ICO stores rows bottom to top: row 0 in DIB is bottom row of image
    const imgY = (height - 1) - y;
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 4;
      const dx = x - cx;
      const dy = imgY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Check solar rays
      const angle = Math.atan2(dy, dx);
      // 8 rays every 45 deg (PI/4)
      const rayAngleDiff = Math.abs((angle % (Math.PI / 4)));
      const isRay = (rayAngleDiff < 0.12 || rayAngleDiff > (Math.PI / 4 - 0.12)) && dist >= 8.5 && dist <= 14.5;

      if (dist <= 13.0 || isRay) {
        if (dist <= 4.0) {
          // Inner core center (Golden white)
          pixels[offset + 0] = 0xFF; // Blue
          pixels[offset + 1] = 0xF5; // Green
          pixels[offset + 2] = 0xFE; // Red
          pixels[offset + 3] = 0xFF; // Alpha
        } else if (dist <= 7.5) {
          // Solar core (Bright Gold Amber)
          pixels[offset + 0] = 0x1A; // Blue
          pixels[offset + 1] = 0xA0; // Green
          pixels[offset + 2] = 0xFA; // Red
          pixels[offset + 3] = 0xFF; // Alpha
        } else if (isRay) {
          // Pure white rays
          pixels[offset + 0] = 0xFF; // Blue
          pixels[offset + 1] = 0xFF; // Green
          pixels[offset + 2] = 0xFF; // Red
          pixels[offset + 3] = 0xFA; // Alpha
        } else {
          // Outer warm sun gradient (Orange to Amber)
          const factor = (dist - 7.5) / 5.5;
          const r = Math.round(0xFA - factor * 0x15);
          const g = Math.round(0x90 - factor * 0x30);
          const b = Math.round(0x10 - factor * 0x05);
          pixels[offset + 0] = b;
          pixels[offset + 1] = g;
          pixels[offset + 2] = r;
          pixels[offset + 3] = 0xFF;
        }
      } else {
        // Transparent
        pixels[offset + 0] = 0x00;
        pixels[offset + 1] = 0x00;
        pixels[offset + 2] = 0x00;
        pixels[offset + 3] = 0x00;
      }
    }
  }

  // AND mask (all 0 for 32-bit transparent alpha)
  const andMask = Buffer.alloc(maskSize, 0);

  return Buffer.concat([icoHeader, dirEntry, dibHeader, pixels, andMask]);
}

const icoBuffer = createIcoBuffer(32);

// Target directories
const targetDirs = [
  'public',
  'frontend/public',
  'admin/public',
];

for (const dir of targetDirs) {
  const fullDir = path.resolve(dir);
  if (!fs.existsSync(fullDir)) fs.mkdirSync(fullDir, { recursive: true });

  // Write SVG favicon
  fs.writeFileSync(path.join(fullDir, 'favicon.svg'), svgContent, 'utf8');
  // Write ICO favicon
  fs.writeFileSync(path.join(fullDir, 'favicon.ico'), icoBuffer);

  console.log(`[Success] Updated favicon.svg and favicon.ico in ${dir}`);
}
