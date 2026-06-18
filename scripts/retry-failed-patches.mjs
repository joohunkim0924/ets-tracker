#!/usr/bin/env node
/** Second-pass patch fetch using known Commons filenames. */
import { createHash } from 'crypto';
import { existsSync } from 'fs';
import path from 'path';
import { normalizePatchFile } from './patch-utils.mjs';

const PATCH_DIR = 'public/unit-patches';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';
const DELAY = 8000;

const RETRY = {
  '5A': ['Fifth_United_States_Army_SSI.svg', 'Fifth_Army_(United_States)_SSI.svg'],
  '6A': ['Sixth_United_States_Army_SSI.svg'],
  ICORPS: ['U.S._I_Corps_CSIB.svg'],
  IIICORPS: ['III_Corps_insignia.svg', 'III_Corps_(United_States)_SSI.svg'],
  XVIIIABN: ['The_XVIII_Army_Airborne_Corps_shoulder_sleeve_insignia.svg'],
  '28ID': ['28th_Infantry_Division_SSI.svg'],
  '35ID': ['35th_Infantry_Division_SSI.svg'],
  '36ID': ['36th_Infantry_Division_SSI.svg'],
  '78TD': ['78th_Infantry_Division_SSI.svg'],
  '86TD': ['86th_Infantry_Division_SSI.svg'],
  '87TD': ['87th_Infantry_Division_SSI.svg'],
  '91DIV': ['91st_Infantry_Division_SSI.svg'],
  '94DIV': ['94th_Infantry_Division_SSI.svg'],
  '95DIV': ['95th_Infantry_Division_SSI.svg'],
  '98TD': ['98th_Infantry_Division_SSI.svg'],
  '100TD': ['100th_Infantry_Division_SSI.svg'],
  '102DIV': ['102nd_Infantry_Division_SSI.svg'],
  '104DIV': ['104th_Infantry_Division_SSI.svg'],
  '88RD': ['88th_Infantry_Division_SSI.svg'],
  '11ADA': ['11th_Air_Defense_Artillery_Brigade_SSI.svg'],
  '31ADA': ['31st_Air_Defense_Artillery_Brigade_SSI.svg'],
  '35ADA': ['35th_Air_Defense_Artillery_Brigade_SSI.svg'],
  '38ADA': ['38th_Air_Defense_Artillery_Brigade_SSI.svg'],
  '69ADA': ['69th_Air_Defense_Artillery_Brigade_SSI.svg'],
  '100MD': ['100th_Missile_Defense_Brigade_SSI.svg'],
  '164ADA': ['164th_Air_Defense_Artillery_Brigade_SSI.svg'],
  '174ADA': ['174th_Air_Defense_Artillery_Brigade_SSI.svg'],
  '678ADA': ['678th_Air_Defense_Artillery_Brigade_SSI.svg'],
  '177AB': ['177th_Armored_Brigade_SSI.svg'],
  '194AB': ['194th_Armored_Brigade_SSI.svg'],
  '1AVN': ['1st_Aviation_Brigade_SSI.svg'],
  '12CAB': ['12th_Combat_Aviation_Brigade_SSI.svg'],
  '16CAB': ['16th_Combat_Aviation_Brigade_SSI.svg'],
  '29CAB': ['29th_Combat_Aviation_Brigade_SSI.svg'],
  '63TAB': ['63rd_Theater_Aviation_Brigade_SSI.svg'],
  '77CAB': ['77th_Combat_Aviation_Brigade_SSI.svg'],
  '110AVN': ['110th_Aviation_Brigade_SSI.svg'],
  '128AVN': ['128th_Aviation_Brigade_SSI.svg'],
  '166AVN': ['166th_Aviation_Brigade_SSI.svg'],
  '504EMIB': ['504th_Military_Intelligence_Brigade_SSI.svg'],
  '525EMIB': ['525th_Military_Intelligence_Brigade_SSI.svg'],
  '20EN': ['20th_Engineer_Brigade_SSI.svg'],
  '36EN': ['36th_Engineer_Brigade_SSI.svg'],
  '130EN': ['130th_Engineer_Brigade_SSI.svg'],
  '555EN': ['555th_Engineer_Brigade_SSI.svg'],
  '17FA': ['17th_Field_Artillery_Brigade_SSI.svg'],
  '18FA': ['18th_Field_Artillery_Brigade_SSI.svg'],
  '210FA': ['210th_Field_Artillery_Brigade_SSI.svg'],
  '56TIOG': ['56th_Information_Operations_Group_SSI.svg'],
  '71TIOG': ['71st_Information_Operations_Group_SSI.svg'],
  '151TIOG': ['151st_Information_Operations_Group_SSI.svg'],
  '278ACR': ['278th_Armored_Cavalry_Regiment_SSI.svg'],
};

function urlFor(file) {
  const hash = createHash('md5').update(file).digest('hex');
  return `https://upload.wikimedia.org/wikipedia/commons/${hash[0]}/${hash.slice(0, 2)}/${encodeURIComponent(file)}`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (const [key, files] of Object.entries(RETRY)) {
  const out = path.join(PATCH_DIR, `${key}.png`);
  if (existsSync(out)) continue;

  let ok = false;
  for (const file of files) {
    await sleep(DELAY);
    const res = await fetch(urlFor(file), { headers: { 'User-Agent': UA } });
    if (!res.ok) {
      console.log(`${key}: ${res.status} ${file}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await normalizePatchFile(buf, out);
    console.log(`${key}: ok (${file})`);
    ok = true;
    break;
  }
  if (!ok) console.log(`${key}: FAILED`);
}
