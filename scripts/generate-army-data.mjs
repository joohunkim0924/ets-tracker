#!/usr/bin/env node
import { existsSync } from 'fs';
import { writeFileSync, readFileSync } from 'fs';
import path from 'path';
import { WIKI_FORMATIONS, APP_EXTRA_UNITS } from './formations-manifest.mjs';

const PATCH_DIR = 'public/unit-patches';

const SECTIONS = [
  { comment: 'Field Armies', keys: ['1A', '3A', '5A', '6A', '8A'] },
  { comment: 'Corps', keys: ['ICORPS', 'IIICORPS', 'VCORPS', 'XVIIIABN'] },
  { comment: 'Airborne Divisions', keys: ['11ABN', '82ABN', '101ABN'] },
  { comment: 'Armored Divisions', keys: ['1AD', '1CD'] },
  { comment: 'Infantry Divisions (Active)', keys: ['1ID', '2ID', '3ID', '4ID', '7ID', '10MTN', '25ID'] },
  { comment: 'Infantry Divisions (ARNG)', keys: ['28ID', '29ID', '34ID', '35ID', '36ID', '38ID', '40ID', '42ID'] },
  { comment: 'Training Divisions (USAR)', keys: ['78TD', '86TD', '87TD', '91DIV', '94DIV', '95DIV', '98TD', '100TD', '102DIV', '104DIV'] },
  { comment: 'Readiness Divisions (USAR)', keys: ['88RD'] },
  { comment: 'Airborne Brigades', keys: ['173ABN'] },
  { comment: 'Air Defense Artillery Brigades', keys: ['11ADA', '31ADA', '35ADA', '38ADA', '69ADA', '100MD', '108ADA', '164ADA', '174ADA', '678ADA'] },
  { comment: 'Armored Brigades', keys: ['5AB', '30ABCT', '81SBCT', '155ABCT', '177AB', '194AB'] },
  { comment: 'Aviation Brigades', keys: ['1AVN', '11ECAB', '12CAB', '16CAB', '29CAB', '63TAB', '77CAB', '110AVN', '128AVN', '166AVN', '185CAB', '244ECAB'] },
  { comment: 'Military Intelligence Brigades', keys: ['201EMIB', '504EMIB', '525EMIB'] },
  { comment: 'Engineer Brigades', keys: ['20EN', '36EN', '130EN', '555EN', '7EN'] },
  { comment: 'Field Artillery Brigades', keys: ['17FA', '18FA', '75FA', '210FA'] },
  { comment: 'Special Forces Groups', keys: ['1SFG', '1SFGD', '3SFG', '5SFG', '7SFG', '10SFG', '19SFG', '20SFG'] },
  { comment: 'Information Operations Groups', keys: ['56TIOG', '71TIOG', '151TIOG'] },
  { comment: 'Independent Regiments', keys: ['2CR', '3CR', '3INF', '11ACR', '278ACR', '75RGR', '160SOAR'] },
  { comment: 'Army Major Commands', keys: ['FORSCOM', 'TRADOC', 'AMC', 'USARPAC', 'USAREUR', 'ARNORTH', 'ARSOUTH', 'ARCENTRAL', 'USARAF', 'USARAK', 'INSCOM', 'MEDCOM', 'USACE', 'USACC', 'USASOC', 'USACIDC', 'USACCSA', 'MDW'] },
  { comment: 'Unified Combatant Commands', keys: ['SOCOM', 'CENTCOM', 'INDOPACOM', 'EUCOM', 'NORTHCOM', 'SOUTHCOM', 'AFRICOM', 'CYBERCOM', 'STRATCOM', 'TRANSCOM', 'SPACECOM'] },
  { comment: 'Components', keys: ['USAR', 'ARNG'] },
];

const allUnits = [...WIKI_FORMATIONS, ...APP_EXTRA_UNITS];
const byValue = Object.fromEntries(allUnits.map((u) => [u.value, u]));

function patchFor(key, unit) {
  if (unit?.patch === null) return null;
  if (existsSync(path.join(PATCH_DIR, `${key}.png`))) return `/unit-patches/${key}.png`;
  if (unit?.localOnly && unit.file && existsSync(path.join(PATCH_DIR, unit.file))) {
    return `/unit-patches/${unit.file}`;
  }
  return null;
}

let unitsBlock = 'export const UNITS = [\n';
for (const section of SECTIONS) {
  unitsBlock += `  // ── ${section.comment} ${'─'.repeat(Math.max(0, 54 - section.comment.length))}\n`;
  for (const key of section.keys) {
    const unit = byValue[key];
    unitsBlock += `  { value: "${unit.value}", label: "${unit.label}" },\n`;
  }
}
unitsBlock += '];\n';

let patchesBlock = 'export const UNIT_PATCHES = {\n';
for (const key of SECTIONS.flatMap((s) => s.keys)) {
  const unit = byValue[key];
  const patch = patchFor(key, unit);
  const val = patch === null ? 'null' : `"${patch}"`;
  patchesBlock += `  "${key}":`.padEnd(14) + ` ${val},\n`;
}
patchesBlock += '};\n';

const src = readFileSync('src/lib/army-data.js', 'utf8');
const ranksBlock = src.slice(src.indexOf('export const RANKS'), src.indexOf('export const UNITS'));
const insigniaBlock = src.slice(src.indexOf('// ── Rank Insignia'), src.indexOf('export const UNIT_PATCHES'));

const header = `// Unit list aligned with Wikipedia current Army formations:\n// https://en.wikipedia.org/wiki/List_of_current_formations_of_the_United_States_Army\n// Patches: public/unit-patches (sync: npm run sync-patches)\n\n`;

writeFileSync('src/lib/army-data.js', header + ranksBlock + '\n' + unitsBlock + '\n' + insigniaBlock + patchesBlock + '\n');

const withPatch = SECTIONS.flatMap((s) => s.keys).filter((k) => patchFor(k, byValue[k]) !== null);
console.log(`Wrote army-data.js: ${SECTIONS.flatMap((s) => s.keys).length} units, ${withPatch.length} with patches`);
