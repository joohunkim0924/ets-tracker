/**
 * Current U.S. Army formations from Wikipedia:
 * https://en.wikipedia.org/wiki/List_of_current_formations_of_the_United_States_Army
 *
 * Each entry: { value, label, search?, file? }
 * - file: exact Wikimedia Commons filename when known
 * - search: Commons search query fallback
 */

export const WIKI_FORMATIONS = [
  // ── Field Armies ───────────────────────────────────────────────────
  { value: '1A', label: 'First United States Army', search: 'First United States Army shoulder sleeve insignia' },
  { value: '3A', label: 'Third United States Army', file: 'Third_United_States_Army_CSIB.svg', search: 'Third United States Army shoulder sleeve insignia' },
  { value: '5A', label: 'Fifth United States Army', search: 'Fifth United States Army shoulder sleeve insignia' },
  { value: '6A', label: 'Sixth United States Army', search: 'Sixth United States Army shoulder sleeve insignia' },
  { value: '8A', label: 'Eighth United States Army', file: 'Eighth_United_States_Army_CSIB.svg' },

  // ── Corps ────────────────────────────────────────────────────────────
  { value: 'ICORPS', label: 'I Corps', search: 'I Corps United States Army shoulder sleeve insignia' },
  { value: 'IIICORPS', label: 'III Armored Corps', search: 'III Corps United States Army shoulder sleeve insignia' },
  { value: 'VCORPS', label: 'V Corps', search: 'V Corps United States Army shoulder sleeve insignia' },
  { value: 'XVIIIABN', label: 'XVIII Airborne Corps', search: 'XVIII Airborne Corps shoulder sleeve insignia' },

  // ── Airborne Divisions ───────────────────────────────────────────────
  { value: '11ABN', label: '11th Airborne Division', file: '11th_Airborne_Division_SSI.svg' },
  { value: '82ABN', label: '82nd Airborne Division', file: '82nd_Airborne_Division_SSI.png' },
  { value: '101ABN', label: '101st Airborne Division (Air Assault)', file: '101st_Airborne_Division_SSI.png' },

  // ── Armored Divisions ────────────────────────────────────────────────
  { value: '1AD', label: '1st Armored Division', file: '1st_Armored_Division_SSI.png' },
  { value: '1CD', label: '1st Cavalry Division', file: '1st_Cavalry_Division_SSI.png' },

  // ── Infantry Divisions (Active) ──────────────────────────────────────
  { value: '1ID', label: '1st Infantry Division', file: '1st_Infantry_Division_SSI.png' },
  { value: '2ID', label: '2nd Infantry Division', file: '2nd_Infantry_Division_(US)_SSI.png' },
  { value: '3ID', label: '3rd Infantry Division', file: '3rd_Infantry_Division_SSI.png' },
  { value: '4ID', label: '4th Infantry Division', file: '4th_Infantry_Division_SSI.png' },
  { value: '7ID', label: '7th Infantry Division', file: '7th_Infantry_Division_SSI.png' },
  { value: '10MTN', label: '10th Mountain Division', file: '10th_Mountain_Division_SSI.png' },
  { value: '25ID', label: '25th Infantry Division', file: '25th_Infantry_Division_SSI.png' },

  // ── Infantry Divisions (ARNG) ────────────────────────────────────────
  { value: '28ID', label: '28th Infantry Division (ARNG)', search: '28th Infantry Division shoulder sleeve insignia' },
  { value: '29ID', label: '29th Infantry Division (ARNG)', search: '29th Infantry Division shoulder sleeve insignia' },
  { value: '34ID', label: '34th Infantry Division (ARNG)', search: '34th Infantry Division shoulder sleeve insignia' },
  { value: '35ID', label: '35th Infantry Division (ARNG)', search: '35th Infantry Division shoulder sleeve insignia' },
  { value: '36ID', label: '36th Infantry Division (ARNG)', search: '36th Infantry Division shoulder sleeve insignia' },
  { value: '38ID', label: '38th Infantry Division (ARNG)', search: '38th Infantry Division shoulder sleeve insignia' },
  { value: '40ID', label: '40th Infantry Division (ARNG)', search: '40th Infantry Division shoulder sleeve insignia' },
  { value: '42ID', label: '42nd Infantry Division (ARNG)', search: '42nd Infantry Division shoulder sleeve insignia' },

  // ── Training Divisions (USAR) ────────────────────────────────────────
  { value: '78TD', label: '78th Training Division (USAR)', search: '78th Infantry Division shoulder sleeve insignia' },
  { value: '86TD', label: '86th Training Division (USAR)', search: '86th Infantry Division shoulder sleeve insignia' },
  { value: '87TD', label: '87th Training Division (USAR)', search: '87th Infantry Division shoulder sleeve insignia' },
  { value: '91DIV', label: '91st Division (USAR)', search: '91st Infantry Division shoulder sleeve insignia' },
  { value: '94DIV', label: '94th Division (USAR)', search: '94th Infantry Division shoulder sleeve insignia' },
  { value: '95DIV', label: '95th Division (USAR)', search: '95th Infantry Division shoulder sleeve insignia' },
  { value: '98TD', label: '98th Training Division (USAR)', search: '98th Infantry Division shoulder sleeve insignia' },
  { value: '100TD', label: '100th Division (USAR)', search: '100th Infantry Division shoulder sleeve insignia' },
  { value: '102DIV', label: '102nd Division (USAR)', search: '102nd Infantry Division shoulder sleeve insignia' },
  { value: '104DIV', label: '104th Division (USAR)', search: '104th Infantry Division shoulder sleeve insignia' },

  // ── Readiness Divisions (USAR) ───────────────────────────────────────
  { value: '88RD', label: '88th Readiness Division (USAR)', search: '88th Infantry Division shoulder sleeve insignia' },

  // ── Airborne Brigades ────────────────────────────────────────────────
  { value: '173ABN', label: '173rd Airborne Brigade Combat Team', file: '173rd_Airborne_Brigade_SSI.png' },

  // ── Air Defense Artillery Brigades ───────────────────────────────────
  { value: '11ADA', label: '11th Air Defense Artillery Brigade', search: '11th Air Defense Artillery Brigade shoulder sleeve insignia' },
  { value: '31ADA', label: '31st Air Defense Artillery Brigade', search: '31st Air Defense Artillery Brigade shoulder sleeve insignia' },
  { value: '35ADA', label: '35th Air Defense Artillery Brigade', search: '35th Air Defense Artillery Brigade shoulder sleeve insignia' },
  { value: '38ADA', label: '38th Air Defense Artillery Brigade', search: '38th Air Defense Artillery Brigade shoulder sleeve insignia' },
  { value: '69ADA', label: '69th Air Defense Artillery Brigade', search: '69th Air Defense Artillery Brigade shoulder sleeve insignia' },
  { value: '100MD', label: '100th Missile Defense Brigade (ARNG)', search: '100th Missile Defense Brigade shoulder sleeve insignia' },
  { value: '108ADA', label: '108th Air Defense Artillery Brigade', search: '108th Air Defense Artillery Brigade shoulder sleeve insignia' },
  { value: '164ADA', label: '164th Air Defense Artillery Brigade (ARNG)', search: '164th Air Defense Artillery Brigade shoulder sleeve insignia' },
  { value: '174ADA', label: '174th Air Defense Artillery Brigade (ARNG)', search: '174th Air Defense Artillery Brigade shoulder sleeve insignia' },
  { value: '678ADA', label: '678th Air Defense Artillery Brigade (ARNG)', search: '678th Air Defense Artillery Brigade shoulder sleeve insignia' },

  // ── Armored Brigades ─────────────────────────────────────────────────
  { value: '5AB', label: '5th Armored Brigade (USAR)', search: '5th Armored Brigade shoulder sleeve insignia' },
  { value: '30ABCT', label: '30th Armored Brigade Combat Team (ARNG)', search: '30th Armored Brigade Combat Team shoulder sleeve insignia' },
  { value: '81SBCT', label: '81st Stryker Brigade Combat Team (ARNG)', search: '81st Stryker Brigade Combat Team shoulder sleeve insignia' },
  { value: '155ABCT', label: '155th Armored Brigade Combat Team (ARNG)', search: '155th Armored Brigade Combat Team shoulder sleeve insignia' },
  { value: '177AB', label: '177th Armored Brigade (USAR)', search: '177th Armored Brigade shoulder sleeve insignia' },
  { value: '194AB', label: '194th Armored Brigade', search: '194th Armored Brigade shoulder sleeve insignia' },

  // ── Aviation Brigades ────────────────────────────────────────────────
  { value: '1AVN', label: '1st Aviation Brigade', search: '1st Aviation Brigade United States Army shoulder sleeve insignia' },
  { value: '11ECAB', label: '11th Expeditionary Combat Aviation Brigade (USAR)', search: '11th Expeditionary Combat Aviation Brigade shoulder sleeve insignia' },
  { value: '12CAB', label: '12th Combat Aviation Brigade', search: '12th Combat Aviation Brigade shoulder sleeve insignia' },
  { value: '16CAB', label: '16th Combat Aviation Brigade', search: '16th Combat Aviation Brigade shoulder sleeve insignia' },
  { value: '29CAB', label: '29th Combat Aviation Brigade (ARNG)', search: '29th Combat Aviation Brigade shoulder sleeve insignia' },
  { value: '63TAB', label: '63rd Theater Aviation Brigade (ARNG)', search: '63rd Theater Aviation Brigade shoulder sleeve insignia' },
  { value: '77CAB', label: '77th Combat Aviation Brigade (ARNG)', search: '77th Combat Aviation Brigade shoulder sleeve insignia' },
  { value: '110AVN', label: '110th Aviation Brigade', search: '110th Aviation Brigade shoulder sleeve insignia' },
  { value: '128AVN', label: '128th Aviation Brigade', search: '128th Aviation Brigade shoulder sleeve insignia' },
  { value: '166AVN', label: '166th Aviation Brigade (USAR)', search: '166th Aviation Brigade shoulder sleeve insignia' },
  { value: '185CAB', label: '185th Aviation Brigade (ARNG)', search: '185th Aviation Brigade shoulder sleeve insignia' },
  { value: '244ECAB', label: '244th Expeditionary Combat Aviation Brigade (USAR)', search: '244th Expeditionary Combat Aviation Brigade shoulder sleeve insignia' },

  // ── Military Intelligence Brigades ───────────────────────────────────
  { value: '201EMIB', label: '201st Expeditionary Military Intelligence Brigade', search: '201st Military Intelligence Brigade shoulder sleeve insignia' },
  { value: '504EMIB', label: '504th Expeditionary Military Intelligence Brigade', search: '504th Military Intelligence Brigade shoulder sleeve insignia' },
  { value: '525EMIB', label: '525th Expeditionary Military Intelligence Brigade', search: '525th Military Intelligence Brigade shoulder sleeve insignia' },

  // ── Engineer Brigades ────────────────────────────────────────────────
  { value: '20EN', label: '20th Engineer Brigade', search: '20th Engineer Brigade shoulder sleeve insignia' },
  { value: '36EN', label: '36th Engineer Brigade', search: '36th Engineer Brigade shoulder sleeve insignia' },
  { value: '130EN', label: '130th Engineer Brigade', search: '130th Engineer Brigade shoulder sleeve insignia' },
  { value: '555EN', label: '555th Engineer Brigade', search: '555th Engineer Brigade shoulder sleeve insignia' },
  { value: '7EN', label: '7th Engineer Brigade', search: '7th Engineer Brigade United States Army shoulder sleeve insignia' },

  // ── Field Artillery Brigades ─────────────────────────────────────────
  { value: '17FA', label: '17th Field Artillery Brigade', search: '17th Field Artillery Brigade shoulder sleeve insignia' },
  { value: '18FA', label: '18th Field Artillery Brigade', search: '18th Field Artillery Brigade shoulder sleeve insignia' },
  { value: '75FA', label: '75th Field Artillery Brigade', search: '75th Field Artillery Brigade shoulder sleeve insignia' },
  { value: '210FA', label: '210th Field Artillery Brigade', search: '210th Field Artillery Brigade shoulder sleeve insignia' },

  // ── Special Forces Groups ────────────────────────────────────────────
  { value: '1SFG', label: '1st Special Forces Group (Airborne)', file: '1st_Special_Forces_Command_(Airborne)_SSI.png' },
  { value: '1SFGD', label: '1st SFG – Det. 1 (JBLM)', search: '1st Special Forces Group shoulder sleeve insignia' },
  { value: '3SFG', label: '3rd Special Forces Group (Airborne)', file: '3rd_Special_Forces_Group_(Airborne)_SSI.png' },
  { value: '5SFG', label: '5th Special Forces Group (Airborne)', file: '5th_Special_Forces_Group_(Airborne)_SSI.png' },
  { value: '7SFG', label: '7th Special Forces Group (Airborne)', file: '7th_Special_Forces_Group_(Airborne)_SSI.png' },
  { value: '10SFG', label: '10th Special Forces Group (Airborne)', file: '10th_Special_Forces_Group_(Airborne)_SSI.png' },
  { value: '19SFG', label: '19th Special Forces Group (Airborne) – ARNG', file: '19th_Special_Forces_Group_(Airborne)_SSI.png' },
  { value: '20SFG', label: '20th Special Forces Group (Airborne) – ARNG', file: '20th_Special_Forces_Group_(Airborne)_SSI.png' },

  // ── Information Operations Groups ────────────────────────────────────
  { value: '56TIOG', label: '56th Theater Information Operations Group (ARNG)', search: '56th Information Operations Group shoulder sleeve insignia' },
  { value: '71TIOG', label: '71st Theater Information Operations Group (ARNG)', search: '71st Information Operations Group shoulder sleeve insignia' },
  { value: '151TIOG', label: '151st Theater Information Operations Group (USAR)', search: '151st Information Operations Group shoulder sleeve insignia' },

  // ── Independent Regiments ────────────────────────────────────────────
  { value: '2CR', label: '2nd Cavalry Regiment', search: '2nd Cavalry Regiment shoulder sleeve insignia' },
  { value: '3CR', label: '3rd Cavalry Regiment', search: '3rd Cavalry Regiment shoulder sleeve insignia' },
  { value: '3INF', label: '3rd Infantry Regiment (The Old Guard)', search: '3rd Infantry Regiment Old Guard shoulder sleeve insignia' },
  { value: '11ACR', label: '11th Armored Cavalry Regiment', search: '11th Armored Cavalry Regiment shoulder sleeve insignia' },
  { value: '278ACR', label: '278th Armored Cavalry Regiment (ARNG)', search: '278th Armored Cavalry Regiment shoulder sleeve insignia' },
  { value: '75RGR', label: '75th Ranger Regiment', file: '75th_Ranger_Regiment_SSI.png' },
  { value: '160SOAR', label: '160th Special Operations Aviation Regiment', file: '160th_Special_Operations_Aviation_Regiment_(Airborne)_SSI.png' },
];

/** App-specific units not on the Wikipedia formations list (kept for user selection). */
export const APP_EXTRA_UNITS = [
  { value: 'FORSCOM', label: 'Forces Command (FORSCOM)', file: 'FORSCOM.png', localOnly: true },
  { value: 'TRADOC', label: 'Training & Doctrine Command (TRADOC)', file: 'TRADOC.png', localOnly: true },
  { value: 'AMC', label: 'Army Materiel Command (AMC)', file: 'AMC.png', localOnly: true },
  { value: 'USARPAC', label: 'U.S. Army Pacific (USARPAC)', file: 'USARPAC.png', localOnly: true },
  { value: 'USAREUR', label: 'U.S. Army Europe & Africa (USAREUR-AF)', file: 'USAREUR.png', localOnly: true },
  { value: 'ARNORTH', label: 'U.S. Army North (ARNORTH)', file: 'ARNORTH.png', localOnly: true },
  { value: 'ARSOUTH', label: 'U.S. Army South (ARSOUTH)', file: 'ARSOUTH.png', localOnly: true },
  { value: 'ARCENTRAL', label: 'U.S. Army Central (ARCENT)', file: 'ARCENTRAL.png', localOnly: true },
  { value: 'USARAF', label: 'U.S. Army Africa (USARAF)', file: 'USARAF.png', localOnly: true },
  { value: 'USARAK', label: 'U.S. Army Alaska (USARAK)', file: 'USARAK.png', localOnly: true },
  { value: 'INSCOM', label: 'Intelligence & Security Command (INSCOM)', file: 'INSCOM.jpg', localOnly: true },
  { value: 'MEDCOM', label: 'Medical Command (MEDCOM)', file: 'MEDCOM.png', localOnly: true },
  { value: 'USACE', label: 'Corps of Engineers (USACE)', file: 'USACE.gif', localOnly: true },
  { value: 'USACC', label: 'Cadet Command (USACC / ROTC)', file: 'USACC.png', localOnly: true },
  { value: 'USASOC', label: 'Army Special Operations Command (USASOC)', file: 'USASOC.png', localOnly: true },
  { value: 'USACIDC', label: 'Criminal Investigation Division (CID)', file: 'USACIDC.png', localOnly: true },
  { value: 'USACCSA', label: 'Cyber Command (ARCYBER)', file: 'USACCSA.png', localOnly: true },
  { value: 'MDW', label: 'Military District of Washington (MDW)', file: 'MDW.png', localOnly: true },
  { value: 'SOCOM', label: 'Special Operations Command (USSOCOM)', file: 'SOCOM.png', localOnly: true },
  { value: 'CENTCOM', label: 'Central Command (USCENTCOM)', file: 'CENTCOM.png', localOnly: true },
  { value: 'INDOPACOM', label: 'Indo-Pacific Command (USINDOPACOM)', file: 'INDOPACOM.png', localOnly: true },
  { value: 'EUCOM', label: 'European Command (USEUCOM)', file: 'EUCOM.png', localOnly: true },
  { value: 'NORTHCOM', label: 'Northern Command (USNORTHCOM)', file: 'NORTHCOM.png', localOnly: true },
  { value: 'SOUTHCOM', label: 'Southern Command (USSOUTHCOM)', file: 'SOUTHCOM.png', localOnly: true },
  { value: 'AFRICOM', label: 'Africa Command (USAFRICOM)', file: 'AFRICOM.png', localOnly: true },
  { value: 'CYBERCOM', label: 'Cyber Command (USCYBERCOM)', file: 'CYBERCOM.png', localOnly: true },
  { value: 'STRATCOM', label: 'Strategic Command (USSTRATCOM)', patch: null },
  { value: 'TRANSCOM', label: 'Transportation Command (USTRANSCOM)', patch: null },
  { value: 'SPACECOM', label: 'Space Command (USSPACECOM)', patch: null },
  { value: 'USAR', label: 'U.S. Army Reserve (USAR)', file: 'USAR.png', localOnly: true },
  { value: 'ARNG', label: 'Army National Guard (ARNG)', file: 'ARNG.png', localOnly: true },
];
