import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// 1. Matri Shakti Solar SVG Favicon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="matriSolarGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBBF24" />
      <stop offset="50%" stop-color="#F97316" />
      <stop offset="100%" stop-color="#EA580C" />
    </linearGradient>
    <linearGradient id="matriCoreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
    <filter id="matriDrop" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Base Rounded Squircle -->
  <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#matriSolarGlow)" filter="url(#matriDrop)"/>

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
  <circle cx="32" cy="32" r="12" fill="url(#matriCoreGlow)"/>

  <!-- Solar Grid Accent -->
  <path d="M 24 32 L 40 32 M 32 24 L 32 40" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
  <circle cx="32" cy="32" r="4" fill="#FFFFFF"/>
</svg>`;

// CRC32 implementation for PNG chunks
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(len + 12);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, len + 8);
  chunk.writeUInt32BE(crc32(typeAndData), len + 8);
  return chunk;
}

// Generate Solar Pixel Bitmap (RGBA)
function generateSolarPixels(width, height) {
  const rgba = Buffer.alloc(width * height * 4);
  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  const radius = width * 0.42;
  const squircleR = width * 0.45;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Squircle boundary check
      const nx = Math.abs(dx) / squircleR;
      const ny = Math.abs(dy) / squircleR;
      const squircleVal = Math.pow(nx, 3.2) + Math.pow(ny, 3.2);

      if (squircleVal <= 1.0) {
        // Base gradient (Amber to Orange)
        const t = (x + y) / (width + height);
        let r = Math.round(251 - t * 18);
        let g = Math.round(191 - t * 74);
        let b = Math.round(36 - t * 24);
        let a = 255;

        // Solar rays check
        const angle = Math.atan2(dy, dx);
        const rayAngleDiff = Math.abs(angle % (Math.PI / 4));
        const isRay = (rayAngleDiff < 0.12 || rayAngleDiff > Math.PI / 4 - 0.12) && dist >= radius * 0.55 && dist <= radius * 0.95;

        if (dist <= radius * 0.25) {
          // Pure central highlight
          r = 255; g = 255; b = 255; a = 255;
        } else if (dist <= radius * 0.5) {
          // Bright yellow core
          r = 254; g = 240; b = 138; a = 255;
        } else if (isRay) {
          // White rays
          r = 255; g = 255; b = 255; a = 245;
        } else if (Math.abs(dist - radius * 0.6) < width * 0.035) {
          // White solar ring
          r = 255; g = 255; b = 255; a = 220;
        }

        rgba[idx + 0] = r;
        rgba[idx + 1] = g;
        rgba[idx + 2] = b;
        rgba[idx + 3] = a;
      } else {
        // Transparent outside
        rgba[idx + 0] = 0;
        rgba[idx + 1] = 0;
        rgba[idx + 2] = 0;
        rgba[idx + 3] = 0;
      }
    }
  }
  return rgba;
}

// Generate standard PNG file buffer
function createPngBuffer(width, height) {
  const pixels = generateSolarPixels(width, height);

  // Filter scanlines (filter type 0 = None)
  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (width * 4 + 1);
    scanlines[rowOffset] = 0; // Filter byte: None
    pixels.copy(scanlines, rowOffset + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressedIdat = zlib.deflateSync(scanlines, { level: 9 });

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth 8
  ihdrData.writeUInt8(6, 9); // color type 6: RGBA
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT chunk
  const idatChunk = makeChunk('IDAT', compressedIdat);

  // IEND chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Generate Windows .ICO Buffer with 16x16, 32x32, 48x48
function createMultiIcoBuffer() {
  const sizes = [16, 32, 48];
  const count = sizes.length;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const dirEntries = [];
  const imageBuffers = [];

  let currentOffset = 6 + count * 16;

  for (const s of sizes) {
    const width = s;
    const height = s;
    const pixelCount = width * height;
    const imageSize = pixelCount * 4;
    const maskRowSize = Math.floor((width + 31) / 32) * 4;
    const maskSize = maskRowSize * height;
    const dibHeaderSize = 40;
    const totalDataSize = dibHeaderSize + imageSize + maskSize;

    const entry = Buffer.alloc(16);
    entry.writeUInt8(width === 256 ? 0 : width, 0);
    entry.writeUInt8(height === 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(totalDataSize, 8);
    entry.writeUInt32LE(currentOffset, 12);
    dirEntries.push(entry);

    currentOffset += totalDataSize;

    // DIB Header
    const dibHeader = Buffer.alloc(dibHeaderSize);
    dibHeader.writeUInt32LE(dibHeaderSize, 0);
    dibHeader.writeInt32LE(width, 4);
    dibHeader.writeInt32LE(height * 2, 8);
    dibHeader.writeUInt16LE(1, 12);
    dibHeader.writeUInt16LE(32, 14);
    dibHeader.writeUInt32LE(0, 16);
    dibHeader.writeUInt32LE(imageSize + maskSize, 20);
    dibHeader.writeInt32LE(0, 24);
    dibHeader.writeInt32LE(0, 28);
    dibHeader.writeUInt32LE(0, 32);
    dibHeader.writeUInt32LE(0, 36);

    const rawRgba = generateSolarPixels(width, height);
    const dibPixels = Buffer.alloc(imageSize);

    for (let y = 0; y < height; y++) {
      const srcY = (height - 1) - y;
      for (let x = 0; x < width; x++) {
        const srcIdx = (srcY * width + x) * 4;
        const dstIdx = (y * width + x) * 4;
        // DIB is BGRA
        dibPixels[dstIdx + 0] = rawRgba[srcIdx + 2]; // B
        dibPixels[dstIdx + 1] = rawRgba[srcIdx + 1]; // G
        dibPixels[dstIdx + 2] = rawRgba[srcIdx + 0]; // R
        dibPixels[dstIdx + 3] = rawRgba[srcIdx + 3]; // A
      }
    }

    const andMask = Buffer.alloc(maskSize, 0);
    imageBuffers.push(Buffer.concat([dibHeader, dibPixels, andMask]));
  }

  return Buffer.concat([header, ...dirEntries, ...imageBuffers]);
}

// 4. Manifest JSON without any Lovable references
const manifestJsonContent = JSON.stringify(
  {
    name: "Matri Shakti Solar Infrastructure",
    short_name: "Matri Shakti",
    description: "UPNEDA Authorized Partner for PM Surya Ghar Muft Bijli Yojana rooftop solar installations.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f97316",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any maskable"
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png"
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png"
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ]
  },
  null,
  2
);

// Pre-render buffers
console.log("Generating Matri Shakti Solar Icons...");
const icoBuf = createMultiIcoBuffer();
const png16 = createPngBuffer(16, 16);
const png32 = createPngBuffer(32, 32);
const png180 = createPngBuffer(180, 180);
const png192 = createPngBuffer(192, 192);
const png512 = createPngBuffer(512, 512);

const targetDirs = [
  'public',
  'frontend/public',
  'admin/public',
];

for (const dir of targetDirs) {
  const fullDir = path.resolve(dir);
  if (!fs.existsSync(fullDir)) fs.mkdirSync(fullDir, { recursive: true });

  fs.writeFileSync(path.join(fullDir, 'favicon.svg'), svgContent, 'utf8');
  fs.writeFileSync(path.join(fullDir, 'favicon.ico'), icoBuf);
  fs.writeFileSync(path.join(fullDir, 'favicon-16x16.png'), png16);
  fs.writeFileSync(path.join(fullDir, 'favicon-32x32.png'), png32);
  fs.writeFileSync(path.join(fullDir, 'apple-touch-icon.png'), png180);
  fs.writeFileSync(path.join(fullDir, 'apple-touch-icon-precomposed.png'), png180);
  fs.writeFileSync(path.join(fullDir, 'icon-192.png'), png192);
  fs.writeFileSync(path.join(fullDir, 'icon-512.png'), png512);
  fs.writeFileSync(path.join(fullDir, 'manifest.json'), manifestJsonContent, 'utf8');
  fs.writeFileSync(path.join(fullDir, 'site.webmanifest'), manifestJsonContent, 'utf8');

  console.log(`[Success] Written complete Matri Shakti icon suite to ${dir}`);
}

console.log("All icons generated successfully!");
