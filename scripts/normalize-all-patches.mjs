#!/usr/bin/env node
/** Re-center all existing key-based PNG patches locally (no network). */
import { readdir } from 'fs/promises';
import path from 'path';
import { normalizePatchPath } from './patch-utils.mjs';

const PATCH_DIR = 'public/unit-patches';
const LEGACY = [
  ['101ABN.jpg', '101ABN.png'],
  ['160SOAR.svg', '160SOAR.png'],
];

for (const [src, dest] of LEGACY) {
  const srcPath = path.join(PATCH_DIR, src);
  const destPath = path.join(PATCH_DIR, dest);
  try {
    await normalizePatchPath(srcPath, destPath);
    console.log(`legacy ${src} -> ${dest}`);
  } catch (e) {
    console.log(`skip ${src}: ${e.message}`);
  }
}

const files = await readdir(PATCH_DIR);
for (const file of files) {
  if (!file.endsWith('.png')) continue;
  const full = path.join(PATCH_DIR, file);
  const tmp = `${full}.tmp`;
  try {
    await normalizePatchPath(full, tmp);
    const { rename } = await import('fs/promises');
    await rename(tmp, full);
    console.log(`normalized ${file}`);
  } catch (e) {
    console.log(`skip ${file}: ${e.message}`);
  }
}
