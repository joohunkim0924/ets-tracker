#!/usr/bin/env node
/**
 * Download and center-normalize unit patches from Wikimedia Commons.
 * Usage: node scripts/sync-unit-patches.mjs [--all] [--key=2ID]
 */
import sharp from 'sharp';
import { createHash } from 'crypto';
import { mkdir, readFile, writeFile, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { WIKI_FORMATIONS, APP_EXTRA_UNITS } from './formations-manifest.mjs';

const PATCH_DIR = 'public/unit-patches';
const OUT_SIZE = 512;
const BG = { r: 0, g: 0, b: 0, alpha: 255 };
const UA = 'HooahUnitPatchSync/1.0 (ets-tracker)';

const args = process.argv.slice(2);
const onlyKey = args.find((a) => a.startsWith('--key='))?.split('=')[1];
const forceAll = args.includes('--all');

/** Legacy on-disk filenames before key-based naming. */
const LEGACY_FILES = {
  '101ABN': '101ABN.jpg',
  '160SOAR': '160SOAR.svg',
};

function commonsDirectUrl(filename) {
  const hash = createHash('md5').update(filename).digest('hex');
  return `https://upload.wikimedia.org/wikipedia/commons/${hash[0]}/${hash.slice(0, 2)}/${encodeURIComponent(filename.replace(/ /g, '_'))}`;
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function isBackground(r, g, b, a) {
  if (a < 16) return true;
  return r < 24 && g < 24 && b < 24;
}

async function normalizeToSquare(inputBuffer, outputPath) {
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

async function commonsFileUrl(filename) {
  const direct = commonsDirectUrl(filename);
  try {
    const head = await fetch(direct, { method: 'HEAD', headers: { 'User-Agent': UA } });
    if (head.ok) return direct;
  } catch {
    // fall through to API
  }

  await sleep(1500);
  const api = new URL('https://commons.wikimedia.org/w/api.php');
  api.searchParams.set('action', 'query');
  api.searchParams.set('titles', `File:${filename}`);
  api.searchParams.set('prop', 'imageinfo');
  api.searchParams.set('iiprop', 'url');
  api.searchParams.set('format', 'json');

  const res = await fetch(api, { headers: { 'User-Agent': UA } });
  if (!res.ok) return null;
  const text = await res.text();
  if (!text.startsWith('{')) return null;
  const json = JSON.parse(text);
  const pages = json.query?.pages ?? {};
  const page = Object.values(pages)[0];
  return page?.imageinfo?.[0]?.url ?? null;
}

async function commonsSearch(query) {
  await sleep(1500);
  const api = new URL('https://commons.wikimedia.org/w/api.php');
  api.searchParams.set('action', 'query');
  api.searchParams.set('list', 'search');
  api.searchParams.set('srsearch', query);
  api.searchParams.set('srnamespace', '6');
  api.searchParams.set('srlimit', '8');
  api.searchParams.set('format', 'json');

  const res = await fetch(api, { headers: { 'User-Agent': UA } });
  if (!res.ok) return null;
  const text = await res.text();
  if (!text.startsWith('{')) return null;
  const json = JSON.parse(text);
  const results = json.query?.search ?? [];
  const preferred = results.find((r) =>
    /ssi|shoulder|sleeve|insignia|csib|patch/i.test(r.title),
  );
  const pick = preferred ?? results[0];
  if (!pick) return null;
  const filename = pick.title.replace(/^File:/, '');
  return commonsFileUrl(filename);
}

async function downloadUrl(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function resolvePatchSource(unit) {
  if (unit.patch === null) return null;

  const keyPath = path.join(PATCH_DIR, `${unit.value}.png`);
  const legacy = LEGACY_FILES[unit.value];
  const legacyPath = legacy ? path.join(PATCH_DIR, legacy) : null;

  if (!forceAll) {
    if (existsSync(keyPath)) return { type: 'local', path: keyPath };
    if (legacyPath && existsSync(legacyPath)) return { type: 'local', path: legacyPath };
  }

  if (unit.localOnly) {
    const localPath = path.join(PATCH_DIR, unit.file);
    if (existsSync(localPath)) return { type: 'local', path: localPath };
    return null;
  }

  if (unit.file) {
    const url = await commonsFileUrl(unit.file);
    if (url) return { type: 'remote', url };
  }

  if (unit.search) {
    const url = await commonsSearch(unit.search);
    if (url) return { type: 'remote', url };
  }

  if (legacyPath && existsSync(legacyPath)) return { type: 'local', path: legacyPath };

  return null;
}

async function syncUnit(unit) {
  const outPath = path.join(PATCH_DIR, `${unit.value}.png`);

  if (unit.patch === null) {
    return { value: unit.value, status: 'no-patch' };
  }

  if (!forceAll && !onlyKey && existsSync(outPath)) {
    return { value: unit.value, status: 'skipped' };
  }

  try {
    const source = await resolvePatchSource(unit);
    if (!source) {
      return { value: unit.value, status: 'not-found' };
    }

    let buffer;
    if (source.type === 'local') {
      buffer = await readFile(source.path);
      buffer = await sharp(buffer, { density: 300 }).png().toBuffer();
    } else {
      buffer = await downloadUrl(source.url);
      await sleep(250);
    }

    await normalizeToSquare(buffer, outPath);
    return { value: unit.value, status: 'ok' };
  } catch (err) {
    return { value: unit.value, status: 'error', error: err.message };
  }
}

async function normalizeExistingPng(key) {
  const outPath = path.join(PATCH_DIR, `${key}.png`);
  if (!existsSync(outPath)) return;
  const buffer = await readFile(outPath);
  const tmp = `${outPath}.tmp`;
  await normalizeToSquare(buffer, tmp);
  await sharp(tmp).toFile(outPath);
  const { unlink } = await import('fs/promises');
  await unlink(tmp).catch(() => {});
}

async function main() {
  await mkdir(PATCH_DIR, { recursive: true });

  const allUnits = [...WIKI_FORMATIONS, ...APP_EXTRA_UNITS];
  const units = onlyKey ? allUnits.filter((u) => u.value === onlyKey) : allUnits;

  const results = [];
  for (const unit of units) {
    process.stdout.write(`  ${unit.value}... `);
    const result = await syncUnit(unit);
    results.push(result);
    console.log(result.status + (result.error ? ` (${result.error})` : ''));
    await sleep(onlyKey ? 0 : 80);
  }

  // Re-normalize all key-based PNG patches for consistent centering
  if (forceAll || !onlyKey) {
    console.log('\nRe-normalizing all PNG patches...');
    const files = await readdir(PATCH_DIR);
    for (const file of files) {
      if (!file.endsWith('.png')) continue;
      const key = file.replace(/\.png$/, '');
      if (onlyKey && key !== onlyKey) continue;
      await normalizeExistingPng(key).catch(() => {});
    }
  }

  const failed = results.filter((r) => r.status === 'not-found' || r.status === 'error');
  console.log(`\nDone: ${results.filter((r) => r.status === 'ok').length} ok, ${results.filter((r) => r.status === 'skipped').length} skipped, ${failed.length} failed`);
  if (failed.length) {
    console.log('Failed:', failed.map((f) => `${f.value}(${f.status})`).join(', '));
  }

  // Write patch map for generator
  const patchMap = {};
  for (const unit of allUnits) {
    if (unit.patch === null) {
      patchMap[unit.value] = null;
    } else if (existsSync(path.join(PATCH_DIR, `${unit.value}.png`))) {
      patchMap[unit.value] = `/unit-patches/${unit.value}.png`;
    } else if (unit.localOnly && unit.file) {
      patchMap[unit.value] = `/unit-patches/${unit.file}`;
    } else {
      patchMap[unit.value] = null;
    }
  }
  await writeFile('scripts/.patch-map.json', JSON.stringify(patchMap, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
