#!/usr/bin/env node
/**
 * Fetch missing patches via Wikipedia REST media-list (thumb PNGs avoid Commons 429s).
 */
import { existsSync } from 'fs';
import path from 'path';
import { WIKI_FORMATIONS } from './formations-manifest.mjs';
import { normalizePatchFile } from './patch-utils.mjs';

const PATCH_DIR = 'public/unit-patches';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';
const DELAY_MS = Number(process.env.PATCH_DELAY_MS || 3000);

const WIKI_TITLES = {
  '1A': 'First United States Army',
  '3A': 'Third United States Army',
  '5A': 'Fifth United States Army',
  '6A': 'Sixth United States Army',
  '8A': 'Eighth Army (United States)',
  ICORPS: 'I Corps (United States)',
  IIICORPS: 'III Corps (United States)',
  VCORPS: 'V Corps (United States)',
  XVIIIABN: 'XVIII Airborne Corps',
  '11ABN': '11th Airborne Division',
  '82ABN': '82nd Airborne Division',
  '101ABN': '101st Airborne Division',
  '1AD': '1st Armored Division (United States)',
  '1CD': '1st Cavalry Division',
  '1ID': '1st Infantry Division (United States)',
  '2ID': '2nd Infantry Division (United States)',
  '3ID': '3rd Infantry Division (United States)',
  '4ID': '4th Infantry Division',
  '7ID': '7th Infantry Division (United States)',
  '10MTN': '10th Mountain Division',
  '25ID': '25th Infantry Division (United States)',
  '28ID': '28th Infantry Division (United States)',
  '29ID': '29th Infantry Division (United States)',
  '34ID': '34th Infantry Division (United States)',
  '35ID': '35th Infantry Division (United States)',
  '36ID': '36th Infantry Division (United States)',
  '38ID': '38th Infantry Division (United States)',
  '40ID': '40th Infantry Division (United States)',
  '42ID': '42nd Infantry Division (United States)',
  '78TD': '78th Infantry Division (United States)',
  '86TD': '86th Infantry Division (United States)',
  '87TD': '87th Infantry Division (United States)',
  '91DIV': '91st Infantry Division (United States)',
  '94DIV': '94th Infantry Division (United States)',
  '95DIV': '95th Infantry Division (United States)',
  '98TD': '98th Infantry Division (United States)',
  '100TD': '100th Infantry Division (United States)',
  '102DIV': '102nd Infantry Division (United States)',
  '104DIV': '104th Infantry Division (United States)',
  '88RD': '88th Infantry Division (United States)',
  '173ABN': '173rd Airborne Brigade',
  '11ADA': '11th Air Defense Artillery Brigade',
  '31ADA': '31st Air Defense Artillery Brigade',
  '35ADA': '35th Air Defense Artillery Brigade',
  '38ADA': '38th Air Defense Artillery Brigade',
  '69ADA': '69th Air Defense Artillery Brigade',
  '100MD': '100th Missile Defense Brigade',
  '108ADA': '108th Air Defense Artillery Brigade (United States)',
  '164ADA': '164th Air Defense Artillery Brigade',
  '174ADA': '174th Air Defense Artillery Brigade',
  '678ADA': '678th Air Defense Artillery Brigade',
  '5AB': '5th Armored Brigade (United States)',
  '30ABCT': '30th Armored Brigade Combat Team',
  '81SBCT': '81st Stryker Brigade Combat Team',
  '155ABCT': '155th Armored Brigade Combat Team',
  '177AB': '177th Armored Brigade',
  '194AB': '194th Armored Brigade',
  '1AVN': '1st Aviation Brigade (United States)',
  '11ECAB': '11th Expeditionary Combat Aviation Brigade',
  '12CAB': '12th Combat Aviation Brigade',
  '16CAB': '16th Combat Aviation Brigade',
  '29CAB': '29th Combat Aviation Brigade',
  '63TAB': '63rd Theater Aviation Brigade',
  '77CAB': '77th Combat Aviation Brigade',
  '110AVN': '110th Aviation Brigade (United States)',
  '128AVN': '128th Aviation Brigade (United States)',
  '166AVN': '166th Aviation Brigade',
  '185CAB': '185th Aviation Brigade (United States)',
  '244ECAB': '244th Expeditionary Combat Aviation Brigade',
  '201EMIB': '201st Expeditionary Military Intelligence Brigade',
  '504EMIB': '504th Military Intelligence Brigade',
  '525EMIB': '525th Expeditionary Military Intelligence Brigade',
  '20EN': '20th Engineer Brigade (United States)',
  '36EN': '36th Engineer Brigade',
  '130EN': '130th Engineer Brigade (United States)',
  '555EN': '555th Engineer Brigade',
  '7EN': '7th Engineer Brigade (United States)',
  '17FA': '17th Field Artillery Brigade',
  '18FA': '18th Field Artillery Brigade (United States)',
  '75FA': '75th Field Artillery Brigade (United States)',
  '210FA': '210th Field Artillery Brigade',
  '1SFG': '1st Special Forces Group (United States)',
  '1SFGD': '1st Special Forces Group (United States)',
  '3SFG': '3rd Special Forces Group (United States)',
  '5SFG': '5th Special Forces Group (United States)',
  '7SFG': '7th Special Forces Group (United States)',
  '10SFG': '10th Special Forces Group (United States)',
  '19SFG': '19th Special Forces Group',
  '20SFG': '20th Special Forces Group',
  '56TIOG': '56th Theater Information Operations Group',
  '71TIOG': '71st Information Operations Group',
  '151TIOG': '151st Theater Information Operations Group',
  '2CR': '2nd Cavalry Regiment (United States)',
  '3CR': '3rd Cavalry Regiment (United States)',
  '3INF': '3rd Infantry Regiment (United States)',
  '11ACR': '11th Armored Cavalry Regiment',
  '278ACR': '278th Armored Cavalry Regiment',
  '75RGR': '75th Ranger Regiment',
  '160SOAR': '160th Special Operations Aviation Regiment (Airborne)',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function mediaThumbUrl(title) {
  const slug = encodeURIComponent(title.replace(/ /g, '_'));
  const api = `https://en.wikipedia.org/api/rest_v1/page/media-list/${slug}`;
  const res = await fetch(api, { headers: { 'User-Agent': UA } });
  if (!res.ok) return null;
  const json = await res.json();
  const image = json.items?.find((i) => i.type === 'image' && i.leadImage) ?? json.items?.find((i) => i.type === 'image');
  if (!image?.srcset?.length) return null;
  const best = image.srcset[image.srcset.length - 1];
  return `https:${best.src}`;
}

async function main() {
  const missing = WIKI_FORMATIONS.filter((u) => !existsSync(path.join(PATCH_DIR, `${u.value}.png`)));
  console.log(`Fetching ${missing.length} missing patches via REST thumbs...\n`);

  const failed = [];
  for (const unit of missing) {
    const title = WIKI_TITLES[unit.value];
    if (!title) {
      failed.push(unit.value);
      continue;
    }

    await sleep(DELAY_MS);
    const thumbUrl = await mediaThumbUrl(title);
    if (!thumbUrl) {
      console.log(`${unit.value}: no media`);
      failed.push(unit.value);
      continue;
    }

    const res = await fetch(thumbUrl, { headers: { 'User-Agent': UA } });
    if (!res.ok) {
      console.log(`${unit.value}: HTTP ${res.status}`);
      failed.push(unit.value);
      continue;
    }

    const buf = Buffer.from(await res.arrayBuffer());
    await normalizePatchFile(buf, path.join(PATCH_DIR, `${unit.value}.png`));
    console.log(`${unit.value}: ok`);
  }

  console.log('\nFailed:', failed.length ? failed.join(', ') : 'none');
}

main().catch((e) => { console.error(e); process.exit(1); });
