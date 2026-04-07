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
  // Divisions
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
  // Brigades & Regiments
  { value: "173ABN", label: "173rd Airborne Brigade Combat Team" },
  { value: "75RGR",  label: "75th Ranger Regiment" },
  { value: "160SOAR",label: "160th Special Operations Aviation Regiment (Night Stalkers)" },
  // Special Forces Groups
  { value: "1SFG",   label: "1st Special Forces Group (Airborne)" },
  { value: "3SFG",   label: "3rd Special Forces Group (Airborne)" },
  { value: "5SFG",   label: "5th Special Forces Group (Airborne)" },
  { value: "7SFG",   label: "7th Special Forces Group (Airborne)" },
  { value: "10SFG",  label: "10th Special Forces Group (Airborne)" },
  { value: "19SFG",  label: "19th Special Forces Group (Airborne)" },
  { value: "20SFG",  label: "20th Special Forces Group (Airborne)" },
  // Components
  { value: "USAR",   label: "US Army Reserve (USAR)" },
  { value: "ARNG",   label: "Army National Guard (ARNG)" },
];

// Rank insignia images — direct Wikimedia Commons image URLs
export const RANK_INSIGNIA = {
  // Enlisted
  "PV1":  null, // No insignia
  "PV2":  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/US-E2_insignia.svg/160px-US-E2_insignia.svg.png",
  "PFC":  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/US-E3_insignia.svg/160px-US-E3_insignia.svg.png",
  "SPC":  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/US-E4_SPC_insignia.svg/160px-US-E4_SPC_insignia.svg.png",
  "CPL":  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/US-E4_CPL_insignia.svg/160px-US-E4_CPL_insignia.svg.png",
  "SGT":  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/US-E5_insignia.svg/160px-US-E5_insignia.svg.png",
  "SSG":  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/US-E6_insignia.svg/160px-US-E6_insignia.svg.png",
  "SFC":  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/US-E7_insignia.svg/160px-US-E7_insignia.svg.png",
  "MSG":  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/US-E8_MSG_insignia.svg/160px-US-E8_MSG_insignia.svg.png",
  "1SG":  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/US-E8_1SG_insignia.svg/160px-US-E8_1SG_insignia.svg.png",
  "SGM":  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/US-E9_SGM_insignia.svg/160px-US-E9_SGM_insignia.svg.png",
  "CSM":  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/US-E9_CSM_insignia.svg/160px-US-E9_CSM_insignia.svg.png",
  "SMA":  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/US-E9_SMA_insignia.svg/160px-US-E9_SMA_insignia.svg.png",
  // Warrant Officers
  "WO1":  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/US-WO1_insignia.svg/160px-US-WO1_insignia.svg.png",
  "CW2":  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/US-CW2_insignia.svg/160px-US-CW2_insignia.svg.png",
  "CW3":  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/US-CW3_insignia.svg/160px-US-CW3_insignia.svg.png",
  "CW4":  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/US-CW4_insignia.svg/160px-US-CW4_insignia.svg.png",
  "CW5":  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/US-CW5_insignia.svg/160px-US-CW5_insignia.svg.png",
  // Officers
  "2LT":  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/US-O1_insignia.svg/160px-US-O1_insignia.svg.png",
  "1LT":  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/US-O2_insignia.svg/160px-US-O2_insignia.svg.png",
  "CPT":  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/US-O3_insignia.svg/160px-US-O3_insignia.svg.png",
  "MAJ":  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/US-O4_insignia.svg/160px-US-O4_insignia.svg.png",
  "LTC":  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/US-O5_insignia.svg/160px-US-O5_insignia.svg.png",
  "COL":  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/US-O6_insignia.svg/160px-US-O6_insignia.svg.png",
  "BG":   "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/US-O7_insignia.svg/160px-US-O7_insignia.svg.png",
  "MG":   "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/US-O8_insignia.svg/160px-US-O8_insignia.svg.png",
  "LTG":  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/US-O9_insignia.svg/160px-US-O9_insignia.svg.png",
  "GEN":  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/US-O10_insignia.svg/160px-US-O10_insignia.svg.png",
};

// Unit patch images — direct Wikimedia Commons image URLs
export const UNIT_PATCHES = {
  // Divisions
  "1AD":    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/United_States_Army_1st_Armored_Division_CSIB.svg/960px-United_States_Army_1st_Armored_Division_CSIB.svg.png",
  "1CD":    "https://upload.wikimedia.org/wikipedia/commons/c/c6/1st_Cavalry_Division_CSIB.png",
  "1ID":    "https://upload.wikimedia.org/wikipedia/commons/4/43/United_States_Army_1st_Infantry_Division_CSIB.png",
  "3ID":    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/United_States_Army_3rd_Infantry_Division_SSI_%281918-2015%29.svg/960px-United_States_Army_3rd_Infantry_Division_SSI_%281918-2015%29.svg.png",
  "4ID":    "https://upload.wikimedia.org/wikipedia/commons/0/0f/4th_Infantry_Division_CSIB.png",
  "7ID":    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/7th_Infantry_Division_SSI_%281973-2015%29.svg/960px-7th_Infantry_Division_SSI_%281973-2015%29.svg.png",
  "10MTN":  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Shoulder_sleeve_insignia_of_the_10th_Mountain_Division_%281944-2015%29.svg/960px-Shoulder_sleeve_insignia_of_the_10th_Mountain_Division_%281944-2015%29.svg.png",
  "11ABN":  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/11th_Airborne_Division_Insignia_2022.png/500px-11th_Airborne_Division_Insignia_2022.png",
  "25ID":   "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/25th_Infantry_Division_CSIB.svg/960px-25th_Infantry_Division_CSIB.svg.png",
  "82ABN":  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/82nd_Airborne_Division_CSIB.svg/960px-82nd_Airborne_Division_CSIB.svg.png",
  "101ABN": "https://upload.wikimedia.org/wikipedia/commons/0/02/101AirborneDivCSIB.jpg",
  // Brigades & Regiments
  "173ABN": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/173Airborne_Brigade_Shoulder_Patch.png/500px-173Airborne_Brigade_Shoulder_Patch.png",
  "75RGR":  "https://upload.wikimedia.org/wikipedia/commons/6/6f/75th_Ranger_Regiment_insignia.png",
  "160SOAR":"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/160th_SOAR_SSI.svg/960px-160th_SOAR_SSI.svg.png",
  // Special Forces Groups
  "1SFG":   "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/1sfg.svg/960px-1sfg.svg.png",
  "3SFG":   "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/3sfg.svg/960px-3sfg.svg.png",
  "5SFG":   "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/5th_Special_Forces_Group_%28Airborne%29_beret_flash.svg/960px-5th_Special_Forces_Group_%28Airborne%29_beret_flash.svg.png",
  "7SFG":   "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/7sfg.svg/960px-7sfg.svg.png",
  "10SFG":  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/10sfg.svg/960px-10sfg.svg.png",
  "19SFG":  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/19sfg.svg/960px-19sfg.svg.png",
  "20SFG":  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/20sfg.svg/960px-20sfg.svg.png",
  // Components
  "USAR":   "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/US_Army_Reserve_Command_SSI.svg/960px-US_Army_Reserve_Command_SSI.svg.png",
  "ARNG":   "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/ARNG-SSI.svg/960px-ARNG-SSI.svg.png",
};