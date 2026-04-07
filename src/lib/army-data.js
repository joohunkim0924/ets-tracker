export const RANKS = [
  // Enlisted
  "PV1", "PV2", "PFC", "SPC", "CPL",
  "SGT", "SSG", "SFC", "MSG", "1SG", "SGM", "CSM", "SMA",
  // Warrant Officers
  "WO1", "CW2", "CW3", "CW4", "CW5",
  // Officers
  "2LT", "1LT", "CPT", "MAJ", "LTC", "COL", "BG", "MG", "LTG", "GEN",
];

export const UNITS = [
  // ── Divisions ──────────────────────────────────────────────────────
  { value: "1AD",    label: "1st Armored Division" },
  { value: "1CD",    label: "1st Cavalry Division" },
  { value: "1ID",    label: "1st Infantry Division" },
  { value: "3ID",    label: "3rd Infantry Division" },
  { value: "4ID",    label: "4th Infantry Division" },
  { value: "7ID",    label: "7th Infantry Division" },
  { value: "10MTN",  label: "10th Mountain Division" },
  { value: "11ABN",  label: "11th Airborne Division" },
  { value: "25ID",   label: "25th Infantry Division" },
  { value: "82ABN",  label: "82nd Airborne Division" },
  { value: "101ABN", label: "101st Airborne Division (Air Assault)" },
  // ── Brigades & Regiments ───────────────────────────────────────────
  { value: "173ABN", label: "173rd Airborne Brigade Combat Team" },
  { value: "75RGR",  label: "75th Ranger Regiment" },
  { value: "160SOAR",label: "160th Special Operations Aviation Regiment" },
  // ── Special Forces Groups ──────────────────────────────────────────
  { value: "1SFG",   label: "1st Special Forces Group (Airborne)" },
  { value: "1SFGD",  label: "1st SFG – Det. 1 (Ft. Lewis / JBLM)" },
  { value: "3SFG",   label: "3rd Special Forces Group (Airborne)" },
  { value: "5SFG",   label: "5th Special Forces Group (Airborne)" },
  { value: "7SFG",   label: "7th Special Forces Group (Airborne)" },
  { value: "10SFG",  label: "10th Special Forces Group (Airborne)" },
  { value: "19SFG",  label: "19th Special Forces Group (Airborne) – ARNG" },
  { value: "20SFG",  label: "20th Special Forces Group (Airborne) – ARNG" },
  // ── Army Major Commands (ACOM) ─────────────────────────────────────
  { value: "FORSCOM",label: "Forces Command (FORSCOM)" },
  { value: "TRADOC", label: "Training & Doctrine Command (TRADOC)" },
  { value: "AMC",    label: "Army Materiel Command (AMC)" },
  { value: "USARPAC",label: "U.S. Army Pacific (USARPAC)" },
  { value: "USAREUR",label: "U.S. Army Europe & Africa (USAREUR-AF)" },
  { value: "ARNORTH",label: "U.S. Army North (ARNORTH / 5th Army)" },
  { value: "ARSOUTH",label: "U.S. Army South (ARSOUTH)" },
  { value: "ARCENTRAL", label: "U.S. Army Central (ARCENT / 3rd Army)" },
  { value: "USARAF", label: "U.S. Army Africa (USARAF)" },
  { value: "USARAK", label: "U.S. Army Alaska (USARAK / 11th Airborne)" },
  { value: "INSCOM", label: "Intelligence & Security Command (INSCOM)" },
  { value: "MEDCOM", label: "Medical Command (MEDCOM)" },
  { value: "USACE",  label: "Corps of Engineers (USACE)" },
  { value: "USACC",  label: "Cadet Command (USACC / ROTC)" },
  { value: "USASOC", label: "Army Special Operations Command (USASOC)" },
  { value: "USACIDC",label: "Criminal Investigation Division (CID)" },
  { value: "USACCSA",label: "Cyber Command (ARCYBER)" },
  { value: "MDW",    label: "Military District of Washington (MDW)" },
  // ── Unified Combatant Commands ─────────────────────────────────────
  { value: "SOCOM",  label: "Special Operations Command (USSOCOM)" },
  { value: "CENTCOM",label: "Central Command (USCENTCOM)" },
  { value: "INDOPACOM", label: "Indo-Pacific Command (USINDOPACOM)" },
  { value: "EUCOM",  label: "European Command (USEUCOM)" },
  { value: "NORTHCOM",  label: "Northern Command (USNORTHCOM)" },
  { value: "SOUTHCOM",  label: "Southern Command (USSOUTHCOM)" },
  { value: "AFRICOM", label: "Africa Command (USAFRICOM)" },
  { value: "CYBERCOM", label: "Cyber Command (USCYBERCOM)" },
  { value: "STRATCOM", label: "Strategic Command (USSTRATCOM)" },
  { value: "TRANSCOM", label: "Transportation Command (USTRANSCOM)" },
  { value: "SPACECOM", label: "Space Command (USSPACECOM)" },
  // ── Components ─────────────────────────────────────────────────────
  { value: "USAR",   label: "U.S. Army Reserve (USAR)" },
  { value: "ARNG",   label: "Army National Guard (ARNG)" },
];

// ── Rank Insignia ─────────────────────────────────────────────────────────────
// All URLs are direct image files on upload.wikimedia.org
// Using the "Army-U.S.-OR-XX" and "Army-U.S.-OF-XX" consistent SVG series
export const RANK_INSIGNIA = {
  // Enlisted — Army-U.S.-OR series, 120px (standard Wikimedia step)
  "PV1":  null, // No insignia – shield fallback
  "PV2":  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Army-U.S.-OR-02.svg/120px-Army-U.S.-OR-02.svg.png",
  "PFC":  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Army-U.S.-OR-03.svg/120px-Army-U.S.-OR-03.svg.png",
  "SPC":  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Army-U.S.-OR-04.svg/120px-Army-U.S.-OR-04.svg.png",
  "CPL":  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Army-U.S.-OR-05.svg/120px-Army-U.S.-OR-05.svg.png",
  "SGT":  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Army-U.S.-OR-05b.svg/120px-Army-U.S.-OR-05b.svg.png",
  "SSG":  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Army-U.S.-OR-06.svg/120px-Army-U.S.-OR-06.svg.png",
  "SFC":  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Army-U.S.-OR-07.svg/120px-Army-U.S.-OR-07.svg.png",
  "MSG":  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Army-U.S.-OR-08b.svg/120px-Army-U.S.-OR-08b.svg.png",
  "1SG":  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Army-U.S.-OR-08a.svg/120px-Army-U.S.-OR-08a.svg.png",
  "SGM":  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Army-U.S.-OR-09c.svg/120px-Army-U.S.-OR-09c.svg.png",
  "CSM":  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Army-U.S.-OR-09b.svg/120px-Army-U.S.-OR-09b.svg.png",
  "SMA":  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Army-U.S.-OR-09a.svg/120px-Army-U.S.-OR-09a.svg.png",
  // Warrant Officers — Army-U.S.-WO series, 120px
  "WO1":  "https://upload.wikimedia.org/wikipedia/commons/9/95/ARMY_WO1.gif",
  "CW2":  "https://upload.wikimedia.org/wikipedia/commons/d/db/ARMY_CW2.gif",
  "CW3":  "https://upload.wikimedia.org/wikipedia/commons/f/f3/ARMY_CW3.gif",
  "CW4":  "https://upload.wikimedia.org/wikipedia/commons/e/e6/ARMY_CW4.gif",
  "CW5":  "https://upload.wikimedia.org/wikipedia/commons/a/a4/ARMY_CW5.png",
  // Officers — Army-U.S.-OF series, 120px (verified from SVG category)
  "2LT":  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/2LT-Army.jpg/120px-2LT-Army.jpg",
  "1LT":  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/1LT-Army.jpg/120px-1LT-Army.jpg",
  "CPT":  "https://upload.wikimedia.org/wikipedia/commons/e/ea/US_ARMY_CPT.gif",
  "MAJ":  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/09-US_Army_Mess_Uniform-MAJ.svg/120px-09-US_Army_Mess_Uniform-MAJ.svg.png",
  "LTC":  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/10-US_Army_Mess_Uniform-LTC.svg/120px-10-US_Army_Mess_Uniform-LTC.svg.png",
  "COL":  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/11-US_Army_Mess_Uniform-COL.svg/120px-11-US_Army_Mess_Uniform-COL.svg.png",
  "BG":   "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/12-US_Army_Mess_Uniform-BG.svg/120px-12-US_Army_Mess_Uniform-BG.svg.png",
  "MG":   "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/13-US_Army_Mess_Uniform-MG.svg/120px-13-US_Army_Mess_Uniform-MG.svg.png",
  "LTG":  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/14-US_Army_Mess_Uniform-LG.svg/120px-14-US_Army_Mess_Uniform-LG.svg.png",
  "GEN":  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/15-US_Army_Mess_Uniform-GEN.svg/120px-15-US_Army_Mess_Uniform-GEN.svg.png",
};

// ── Unit Patches / SSI ────────────────────────────────────────────────────────
// All URLs are direct image files on upload.wikimedia.org
export const UNIT_PATCHES = {
  // Divisions
  "1AD":    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/United_States_Army_1st_Armored_Division_CSIB.svg/960px-United_States_Army_1st_Armored_Division_CSIB.svg.png",
  "1CD":    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/1st_Cavalry_Division_CSIB.png/960px-1st_Cavalry_Division_CSIB.png",
  "1ID":    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/United_States_Army_1st_Infantry_Division_CSIB.png/960px-United_States_Army_1st_Infantry_Division_CSIB.png",
  "3ID":    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/United_States_Army_3rd_Infantry_Division_SSI_%281918-2015%29.svg/960px-United_States_Army_3rd_Infantry_Division_SSI_%281918-2015%29.svg.png",
  "4ID":    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/4th_Infantry_Division_CSIB.png/960px-4th_Infantry_Division_CSIB.png",
  "7ID":    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/7th_Infantry_Division_SSI_%281973-2015%29.svg/960px-7th_Infantry_Division_SSI_%281973-2015%29.svg.png",
  "10MTN":  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Shoulder_sleeve_insignia_of_the_10th_Mountain_Division_%281944-2015%29.svg/960px-Shoulder_sleeve_insignia_of_the_10th_Mountain_Division_%281944-2015%29.svg.png",
  "11ABN":  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/11th_Airborne_Division_Insignia_2022.png/960px-11th_Airborne_Division_Insignia_2022.png",
  "25ID":   "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/25th_Infantry_Division_CSIB.svg/960px-25th_Infantry_Division_CSIB.svg.png",
  "82ABN":  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/82nd_Airborne_Division_CSIB.svg/960px-82nd_Airborne_Division_CSIB.svg.png",
  "101ABN": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/101AirborneDivCSIB.jpg/960px-101AirborneDivCSIB.jpg",
  // Brigades & Regiments
  "173ABN": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/173Airborne_Brigade_Shoulder_Patch.png/960px-173Airborne_Brigade_Shoulder_Patch.png",
  "75RGR":  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/75th_Ranger_Regiment_insignia.png/960px-75th_Ranger_Regiment_insignia.png",
  "160SOAR":"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/160th_SOAR_SSI.svg/960px-160th_SOAR_SSI.svg.png",
  // Special Forces Groups
  "1SFG":   "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/1sfg.svg/960px-1sfg.svg.png",
  "1SFGD":  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/1sfg.svg/960px-1sfg.svg.png",
  "3SFG":   "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/3sfg.svg/960px-3sfg.svg.png",
  "5SFG":   "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/5th_Special_Forces_Group_%28Airborne%29_beret_flash.svg/960px-5th_Special_Forces_Group_%28Airborne%29_beret_flash.svg.png",
  "7SFG":   "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/7sfg.svg/960px-7sfg.svg.png",
  "10SFG":  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/10sfg.svg/960px-10sfg.svg.png",
  "19SFG":  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/19sfg.svg/960px-19sfg.svg.png",
  "20SFG":  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/20sfg.svg/960px-20sfg.svg.png",
  // Army Major Commands
  "FORSCOM":  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/United_States_Army_Forces_Command_SSI.svg/960px-United_States_Army_Forces_Command_SSI.svg.png",
  "TRADOC":   "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/United_States_Army_Training_and_Doctrine_Command_SSI.svg/960px-United_States_Army_Training_and_Doctrine_Command_SSI.svg.png",
  "AMC":      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/United_States_Army_Materiel_Command_SSI.svg/960px-United_States_Army_Materiel_Command_SSI.svg.png",
  "USARPAC":  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/US_Army_Pacific_Command_SSI.svg/960px-US_Army_Pacific_Command_SSI.svg.png",
  "USAREUR":  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/US_Seventh_Army_SSI.svg/960px-US_Seventh_Army_SSI.svg.png",
  "ARNORTH":  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/United_States_Army_North_CSIB.svg/960px-United_States_Army_North_CSIB.svg.png",
  "ARSOUTH":  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/United_States_Army_South_SSI.svg/960px-United_States_Army_South_SSI.svg.png",
  "ARCENTRAL":"https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/United_States_Army_Central_CSIB.svg/960px-United_States_Army_Central_CSIB.svg.png",
  "USARAF":   "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/U.S._Army_Africa_SSI.svg/960px-U.S._Army_Africa_SSI.svg.png",
  "USARAK":   "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/11th_Airborne_Division_Insignia_2022.png/960px-11th_Airborne_Division_Insignia_2022.png",
  "INSCOM":   "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/United_States_Army_Intelligence_and_Security_Command_SSI.svg/960px-United_States_Army_Intelligence_and_Security_Command_SSI.svg.png",
  "MEDCOM":   "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/US_Army_Medical_Command_SSI.svg/960px-US_Army_Medical_Command_SSI.svg.png",
  "USACE":    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/US_Army_Corps_of_Engineers_SSI.svg/960px-US_Army_Corps_of_Engineers_SSI.svg.png",
  "USACC":    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/US_Army_Cadet_Command_SSI.svg/960px-US_Army_Cadet_Command_SSI.svg.png",
  "USASOC":   "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/U.S._Army_Special_Operations_Command_SSI_%281989-2015%29.png/960px-U.S._Army_Special_Operations_Command_SSI_%281989-2015%29.png",
  "USACIDC":  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/US_Army_Criminal_Investigation_Command_SSI.svg/960px-US_Army_Criminal_Investigation_Command_SSI.svg.png",
  "USACCSA":  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Army_Cyber_Command_SSI.svg/960px-Army_Cyber_Command_SSI.svg.png",
  "MDW":      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Military_District_of_Washington_SSI.svg/960px-Military_District_of_Washington_SSI.svg.png",
  // Unified Combatant Commands (seals used as insignia)
  "SOCOM":    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/United_States_Special_Operations_Command_Insignia.svg/960px-United_States_Special_Operations_Command_Insignia.svg.png",
  "CENTCOM":  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/United_States_Army_Central_CSIB.svg/960px-United_States_Army_Central_CSIB.svg.png",
  "INDOPACOM":"https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/US_Army_Pacific_Command_SSI.svg/960px-US_Army_Pacific_Command_SSI.svg.png",
  "EUCOM":    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/US_Seventh_Army_SSI.svg/960px-US_Seventh_Army_SSI.svg.png",
  "NORTHCOM": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/United_States_Army_North_CSIB.svg/960px-United_States_Army_North_CSIB.svg.png",
  "SOUTHCOM": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/United_States_Army_South_SSI.svg/960px-United_States_Army_South_SSI.svg.png",
  "AFRICOM":  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/U.S._Army_Africa_SSI.svg/960px-U.S._Army_Africa_SSI.svg.png",
  "CYBERCOM": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Army_Cyber_Command_SSI.svg/960px-Army_Cyber_Command_SSI.svg.png",
  "STRATCOM": null,
  "TRANSCOM": null,
  "SPACECOM": null,
  // Components
  "USAR":   "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/US_Army_Reserve_Command_SSI.svg/960px-US_Army_Reserve_Command_SSI.svg.png",
  "ARNG":   "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/ARNG-SSI.svg/960px-ARNG-SSI.svg.png",
};