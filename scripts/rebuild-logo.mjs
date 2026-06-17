import sharp from 'sharp';

const IN = process.argv[2];
if (!IN) {
  console.error('Usage: node scripts/rebuild-logo.mjs <input.png>');
  process.exit(1);
}

const OUT_MASTER = 'src/assets/logo.png';
const OUT_RES_1024 = 'resources/icon-1024.png';

const targetSize = 1024;
const cornerRadius = 160;

const src = sharp(IN).ensureAlpha();
const meta = await src.metadata();
const side = Math.min(meta.width ?? targetSize, meta.height ?? targetSize);
const left = Math.floor(((meta.width ?? side) - side) / 2);
const top = Math.floor(((meta.height ?? side) - side) / 2);

const resized = src
  .extract({ left, top, width: side, height: side })
  .resize(targetSize, targetSize, { kernel: sharp.kernel.lanczos3 });

const { data, info } = await resized.raw().toBuffer({ resolveWithObject: true });

// Brand yellow: hsl(52 96% 48%) => rgb(240,209,5)
const YELLOW = { r: 240, g: 209, b: 5 };
const BLACK = { r: 0, g: 0, b: 0 };
const WHITE = { r: 255, g: 255, b: 255 };

function dist2(p, c) {
  const dr = p.r - c.r;
  const dg = p.g - c.g;
  const db = p.b - c.b;
  return dr * dr + dg * dg + db * db;
}

function isYellow(p) {
  return dist2(p, YELLOW) <= 38 * 38;
}

function isWhite(p) {
  return dist2(p, WHITE) <= 120 * 120;
}

function roundedRectSignedDistance(x, y, size, r) {
  const cx = size / 2;
  const cy = size / 2;
  const hx = size / 2 - r;
  const hy = size / 2 - r;
  const px = Math.abs(x - cx);
  const py = Math.abs(y - cy);
  const qx = px - hx;
  const qy = py - hy;
  const ax = Math.max(qx, 0);
  const ay = Math.max(qy, 0);
  const outside = Math.hypot(ax, ay);
  const inside = Math.min(Math.max(qx, qy), 0);
  return outside + inside - r;
}

function distanceToEdge(x, y) {
  return -roundedRectSignedDistance(x, y, targetSize, cornerRadius);
}

// Build masks from the reference screenshot.
const blackMask = new Uint8Array(targetSize * targetSize);
const whiteMask = new Uint8Array(targetSize * targetSize);

for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * info.channels;
    const a = data[i + 3];
    if (a === 0) continue;

    const p = { r: data[i], g: data[i + 1], b: data[i + 2] };
    const idx = y * targetSize + x;

    if (isWhite(p)) {
      whiteMask[idx] = 1;
    } else if (!isYellow(p)) {
      blackMask[idx] = 1;
    }
  }
}

function floodBlackFrom(sx, sy) {
  const keep = new Uint8Array(targetSize * targetSize);
  if (!blackMask[sy * targetSize + sx]) return keep;

  const queue = [[sx, sy]];
  keep[sy * targetSize + sx] = 1;

  while (queue.length) {
    const [x, y] = queue.pop();
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      const ni = ny * targetSize + nx;
      if (nx < 0 || ny < 0 || nx >= targetSize || ny >= targetSize) continue;
      if (!blackMask[ni] || keep[ni]) continue;
      keep[ni] = 1;
      queue.push([nx, ny]);
    }
  }

  return keep;
}

// The screenshot rim is a separate black ring around the yellow square.
// Flood-fill from the burst interior keeps the burst (incl. spikes) and drops the rim.
let seed = null;
for (let y = 350; y < 680 && !seed; y++) {
  for (let x = 350; x < 680 && !seed; x++) {
    const idx = y * targetSize + x;
    if (blackMask[idx] && distanceToEdge(x, y) > 70) {
      seed = [x, y];
    }
  }
}

if (!seed) {
  throw new Error('Could not find burst seed pixel in reference image');
}

const burstMask = floodBlackFrom(seed[0], seed[1]);

// Rim = disconnected outer black ring. Letter counters (O, A holes) are also
// disconnected from the main burst but sit well inside the icon — keep those.
const RIM_EDGE_DISTANCE = 28;
const keepBlackMask = new Uint8Array(targetSize * targetSize);
for (let y = 0; y < targetSize; y++) {
  for (let x = 0; x < targetSize; x++) {
    const idx = y * targetSize + x;
    if (!blackMask[idx]) continue;
    if (burstMask[idx] || distanceToEdge(x, y) >= RIM_EDGE_DISTANCE) {
      keepBlackMask[idx] = 1;
    }
  }
}

const fg = Buffer.alloc(targetSize * targetSize * 4);
let fgCount = 0;

for (let y = 0; y < targetSize; y++) {
  for (let x = 0; x < targetSize; x++) {
    const idx = y * targetSize + x;
    const outIdx = idx * 4;

    let c = null;
    if (whiteMask[idx]) {
      c = WHITE;
    } else if (keepBlackMask[idx]) {
      c = BLACK;
    } else {
      continue;
    }

    fg[outIdx] = c.r;
    fg[outIdx + 1] = c.g;
    fg[outIdx + 2] = c.b;
    fg[outIdx + 3] = 255;
    fgCount++;
  }
}

const maskSvg = `\
<svg width="${targetSize}" height="${targetSize}" viewBox="0 0 ${targetSize} ${targetSize}" xmlns="http://www.w3.org/2000/svg">\
  <rect x="0" y="0" width="${targetSize}" height="${targetSize}" rx="${cornerRadius}" ry="${cornerRadius}" fill="#fff"/>\
</svg>`;

const out = Buffer.alloc(targetSize * targetSize * 4);
for (let i = 0; i < out.length; i += 4) {
  out[i] = YELLOW.r;
  out[i + 1] = YELLOW.g;
  out[i + 2] = YELLOW.b;
  out[i + 3] = 255;
}

for (let i = 0; i < fg.length; i += 4) {
  if (fg[i + 3] === 0) continue;
  out[i] = fg[i];
  out[i + 1] = fg[i + 1];
  out[i + 2] = fg[i + 2];
  out[i + 3] = 255;
}

const composited = sharp(out, {
  raw: { width: targetSize, height: targetSize, channels: 4 },
});
const masked = composited.composite([{ input: Buffer.from(maskSvg), blend: 'dest-in' }]);

await masked
  .clone()
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(OUT_MASTER);
await masked
  .clone()
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(OUT_RES_1024);

let rimDropped = 0;
let countersKept = 0;
for (let i = 0; i < blackMask.length; i++) {
  if (blackMask[i] && !keepBlackMask[i]) rimDropped++;
  if (blackMask[i] && keepBlackMask[i] && !burstMask[i]) countersKept++;
}

console.log(`Wrote ${OUT_MASTER} and ${OUT_RES_1024}`);
console.log(`Foreground pixels: ${fgCount}`);
console.log(`Rim pixels removed: ${rimDropped}`);
console.log(`Inner black islands kept (letter counters): ${countersKept}`);
