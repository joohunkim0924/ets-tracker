/** @typedef {'pv1'|'pv2'|'pfc'|'spc'|'sgt'|'ssg'} PromotionRank */
/** @typedef {'standard'|'combat'} MosCategory */
/** @typedef {'e5'|'e6'} PromotionTarget */

export const RANK_OPTIONS = [
  { value: 'pv1', label: 'PV1 (E-1)' },
  { value: 'pv2', label: 'PV2 (E-2)' },
  { value: 'pfc', label: 'PFC (E-3)' },
  { value: 'spc', label: 'SPC/CPL (E-4 → E-5)' },
  { value: 'sgt', label: 'SGT (E-5 → E-6)' },
  { value: 'ssg', label: 'SSG+ (E-6+)' },
];

export const JUNIOR_RANKS = new Set(['pv1', 'pv2', 'pfc']);
export const SEMI_RANKS = new Set(['spc', 'sgt']);

export const CATEGORY_CAPS = {
  e5: { awards: 145, militaryEducation: 240, civilianEducation: 185 },
  e6: { awards: 165, militaryEducation: 220, civilianEducation: 160 },
};

export const AWARD_VALUES = {
  arcom: 20,
  aam: 10,
  gcm: 10,
  coa: 5,
  badge: 10,
};

export const JUNIOR_TRACKS = {
  pv1: { next: 'PV2', tisMonths: 6, tigMonths: null, label: 'PV1 → PV2' },
  pv2: { next: 'PFC', tisMonths: 12, tigMonths: 4, label: 'PV2 → PFC' },
  pfc: { next: 'SPC', tisMonths: 24, tigMonths: 6, label: 'PFC → SPC' },
};

const E6_PLUS_RANKS = new Set([
  'SSG', 'SFC', 'MSG', '1SG', 'SGM', 'CSM', 'SMA',
  'WO1', 'CW2', 'CW3', 'CW4', 'CW5',
  '2LT', '1LT', 'CPT', 'MAJ', 'LTC', 'COL', 'BG', 'MG', 'LTG', 'GEN',
]);

export function mapUserRankToPromotion(userRank) {
  if (!userRank) return null;
  const r = String(userRank).trim().toUpperCase();
  if (r === 'PV1') return 'pv1';
  if (r === 'PV2') return 'pv2';
  if (r === 'PFC') return 'pfc';
  if (r === 'SPC' || r === 'CPL') return 'spc';
  if (r === 'SGT') return 'sgt';
  if (E6_PLUS_RANKS.has(r)) return 'ssg';
  return null;
}

export function getPromotionTarget(rank) {
  if (rank === 'sgt') return 'e6';
  if (rank === 'spc') return 'e5';
  return null;
}

export function getRouteForRank(rank) {
  if (JUNIOR_RANKS.has(rank)) return 'junior';
  if (SEMI_RANKS.has(rank)) return 'semi';
  return 'board';
}

export function aftMinTotal(mosCategory) {
  return mosCategory === 'combat' ? 350 : 300;
}

export function validateAftScore(aftScore, mosCategory) {
  const score = Number(aftScore) || 0;
  const min = aftMinTotal(mosCategory);
  if (score > 0 && score < min) {
    return {
      valid: false,
      message: mosCategory === 'combat'
        ? 'Combat specialty MOS requires at least 350 AFT points (60 per event).'
        : 'Standard MOS requires at least 300 AFT points (60 per event).',
    };
  }
  if (score > 500) {
    return { valid: false, message: 'AFT score cannot exceed 500 points.' };
  }
  return { valid: true, message: null };
}

export function aftToPromotionPoints(aftScore, target) {
  const score = Math.max(0, Math.min(500, Number(aftScore) || 0));
  const maxPts = target === 'e6' ? 140 : 120;
  return Math.round((score / 500) * maxPts);
}

export function weaponsHitsToPromotionPoints(hits) {
  const h = Math.max(0, Math.min(40, Number(hits) || 0));
  if (h >= 36) return Math.round(96 + ((h - 36) / 4) * 14);
  if (h >= 30) return Math.round(56 + ((h - 30) / 5) * 35);
  if (h >= 23) return Math.round(28 + ((h - 23) / 6) * 22);
  return 0;
}

export function calculateAwardsPoints(counts, target) {
  const coaPts = Math.min((counts.coa || 0) * AWARD_VALUES.coa, 20);
  const raw =
    (counts.arcom || 0) * AWARD_VALUES.arcom
    + (counts.aam || 0) * AWARD_VALUES.aam
    + (counts.gcm || 0) * AWARD_VALUES.gcm
    + coaPts
    + (counts.badge || 0) * AWARD_VALUES.badge;
  return Math.min(raw, CATEGORY_CAPS[target].awards);
}

export function calculateMilitaryEducationPoints({ correspondenceHours, residentWeeks }, target) {
  const correspondencePts = Math.floor((Number(correspondenceHours) || 0) / 5);
  const residentPts = (Number(residentWeeks) || 0) * 4;
  return Math.min(correspondencePts + residentPts, CATEGORY_CAPS[target].militaryEducation);
}

export function calculateCivilianEducationPoints({ semesterHours, techCerts }, target) {
  const semesterPts = (Number(semesterHours) || 0) * 2;
  const certPts = Math.min((Number(techCerts) || 0) * 10, 50);
  return Math.min(semesterPts + certPts, CATEGORY_CAPS[target].civilianEducation);
}

export function calculateSemiCentralizedTotal(inputs, target) {
  const aft = aftToPromotionPoints(inputs.aftScore, target);
  const weapons = weaponsHitsToPromotionPoints(inputs.weaponsHits);
  const awards = calculateAwardsPoints(inputs.awards, target);
  const militaryEd = calculateMilitaryEducationPoints(inputs.militaryEducation, target);
  const civilianEd = calculateCivilianEducationPoints(inputs.civilianEducation, target);

  return {
    total: aft + weapons + awards + militaryEd + civilianEd,
    breakdown: { aft, weapons, awards, militaryEd, civilianEd },
  };
}

export function getJuniorProgress(rank, monthsTis) {
  const track = JUNIOR_TRACKS[rank];
  if (!track) return null;
  const tisPct = Math.min(100, (monthsTis / track.tisMonths) * 100);
  return { ...track, monthsTis, tisPct };
}

export const DEFAULT_PROMOTION_STATE = {
  rank: 'spc',
  mosCategory: 'standard',
  cutoffScore: 485,
  aftScore: '',
  weaponsHits: '',
  awards: { arcom: 0, aam: 0, gcm: 0, coa: 0, badge: 0 },
  militaryEducation: { correspondenceHours: '', residentWeeks: '', ncoesGraduate: false },
  civilianEducation: { semesterHours: '', techCerts: '' },
  boardChecklist: {
    ncoer: false,
    srb: false,
    deploymentAwards: false,
    msaf: false,
  },
};

export const STORAGE_KEY = 'ets-tracker:promotion-tracker';
export const PROMOTION_POINTS_MAX = 800;

export function loadPromotionTrackerState() {
  if (typeof window === 'undefined') return { ...DEFAULT_PROMOTION_STATE };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_PROMOTION_STATE, ...JSON.parse(raw) };
  } catch {
    /* use defaults */
  }

  return { ...DEFAULT_PROMOTION_STATE };
}

export function getPromotionPointsSummary() {
  const state = loadPromotionTrackerState();
  const target = getPromotionTarget(state.rank);
  if (!target) return null;

  const { total } = calculateSemiCentralizedTotal(
    {
      aftScore: state.aftScore,
      weaponsHits: state.weaponsHits,
      awards: state.awards,
      militaryEducation: state.militaryEducation,
      civilianEducation: state.civilianEducation,
    },
    target,
  );

  if (total <= 0) return null;

  return {
    total,
    max: PROMOTION_POINTS_MAX,
    pct: Math.min(100, (total / PROMOTION_POINTS_MAX) * 100),
    cutoff: Number(state.cutoffScore) || null,
  };
}

export const PROMOTION_TRACKER_UPDATED_EVENT = 'promotion-tracker-updated';
