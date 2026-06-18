import sharp from 'sharp';
import { readFile } from 'fs/promises';

const OUT_SIZE = 512;
const BG = { r: 0, g: 0, b: 0, alpha: 255 };

function isBackground(r, g, b, a) {
  if (a < 16) return true;
  return r < 24 && g < 24 && b < 24;
}

export async function normalizePatchFile(inputBuffer, outputPath) {
  const base = sharp(inputBuffer, { density: 300 }).ensureAlpha();
  const { data, info } = await base.clone().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
      if (!isBackground(r, g, b, a)) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX < minX) throw new Error('No visible patch content');

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  const side = Math.max(cropW, cropH);
  const padX = Math.floor((side - cropW) / 2);
  const padY = Math.floor((side - cropH) / 2);
  const margin = Math.round(side * 0.04);

  await sharp(inputBuffer, { density: 300 })
    .ensureAlpha()
    .extract({ left: minX, top: minY, width: cropW, height: cropH })
    .extend({
      top: padY + margin,
      bottom: side - cropH - padY + margin,
      left: padX + margin,
      right: side - cropW - padX + margin,
      background: BG,
    })
    .resize(OUT_SIZE, OUT_SIZE, { fit: 'fill' })
    .png()
    .toFile(outputPath);
}

export async function normalizePatchPath(inputPath, outputPath) {
  const buffer = await readFile(inputPath);
  await normalizePatchFile(buffer, outputPath);
}
