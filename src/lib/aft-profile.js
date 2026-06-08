import { getAlternateRunLabel } from '@/lib/aft-alternate-events';

export const PROFILE_TYPES = {
  NONE: 'none',
  PERMANENT: 'permanent',
};

export const PROFILE_PASSING_POINTS = 60;

export const PROFILE_OPTIONS = [
  { value: PROFILE_TYPES.NONE, label: 'No Profile' },
  { value: PROFILE_TYPES.PERMANENT, label: 'Profile' },
];

export function getProfileType(score) {
  if (!score) return PROFILE_TYPES.NONE;
  if (score.profile_type === 'temporary') return PROFILE_TYPES.NONE;
  if (score.profile_type) return score.profile_type;
  if (score.permanent_profile) return PROFILE_TYPES.PERMANENT;
  return PROFILE_TYPES.NONE;
}

export function createEmptyExemptions() {
  return {
    deadlift: false,
    pushups: false,
    sprint_drag_carry: false,
    plank: false,
    two_mile_run: false,
  };
}

export function isEventExempt(form, eventKey) {
  return form.profile_type === PROFILE_TYPES.PERMANENT && !!form.event_exemptions?.[eventKey];
}

export function getEventPoints(form, eventKey, pointsKey) {
  if (form.profile_type === PROFILE_TYPES.PERMANENT && form.event_exemptions?.[eventKey]) {
    if (eventKey === 'two_mile_run') {
      return form.alternate_run_pass ? PROFILE_PASSING_POINTS : 0;
    }
    return PROFILE_PASSING_POINTS;
  }
  return Number(form[pointsKey] || 0);
}

export function computeTotalScore(form, events) {
  return events.reduce((sum, ev) => sum + getEventPoints(form, ev.key, ev.pointsKey), 0);
}

export function formatMMSS(secs) {
  if (secs === null || secs === undefined || secs === '—') return '—';
  const m = Math.floor(Number(secs) / 60);
  const s = Number(secs) % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function isScoreEventExempt(score, eventKey) {
  if (getProfileType(score) !== PROFILE_TYPES.PERMANENT) return false;
  if (score.event_exemptions?.[eventKey]) return true;
  return score.permanent_profile && !score.event_exemptions && eventKey === 'two_mile_run';
}

/** Display row for history / overview */
export function describeEventForScore(score, ev) {
  const exempt = isScoreEventExempt(score, ev.key);

  if (exempt && ev.key === 'two_mile_run') {
    const label = getAlternateRunLabel(score.alternate_run_event);
    const pass = score.alternate_run_pass !== false;
    return {
      label,
      raw: pass ? 'PASS (profile)' : 'FAIL (profile)',
      pts: pass ? PROFILE_PASSING_POINTS : 0,
      note: 'Profile',
    };
  }

  if (exempt) {
    return {
      label: ev.label,
      raw: 'Profile minimum',
      pts: PROFILE_PASSING_POINTS,
      note: '60 pts',
    };
  }

  const raw = score?.[ev.key];
  return {
    label: ev.label,
    raw: raw !== undefined && raw !== null
      ? (ev.timeFormat ? formatMMSS(raw) : `${raw}${ev.unit ? ` ${ev.unit}` : ''}`)
      : '—',
    pts: score?.[ev.pointsKey] ?? '—',
  };
}
