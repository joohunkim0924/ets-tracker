import sharp from 'sharp';

const W = 1024;
const H = 500;
const YELLOW = '#F0D105';
const BLACK = '#0F0F0F';

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${BLACK}"/>
  <text
    x="512"
    y="285"
    text-anchor="middle"
    font-family="Arial Black, Arial, Helvetica, sans-serif"
    font-size="120"
    font-weight="900"
    fill="${YELLOW}"
    letter-spacing="12"
  >HOOAH</text>
</svg>`;

const outPath = 'public/hooah-feature-graphic.png';
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outPath);

const { size } = await import('fs/promises').then((fs) => fs.stat(outPath));
console.log(`Wrote ${outPath} (1024x500, ${(size / 1024).toFixed(1)} KB)`);
