/**
 * Derive rifle qualification from hits (standard 40-round table).
 * Expert 36+, Sharpshooter 30–35, Marksman 23–29, else Unqualified.
 */
export function deriveQualification({ hits, total_rounds, score }) {
  const total = Number(total_rounds) > 0 ? Number(total_rounds) : 40;
  let hitCount = null;

  if (hits !== undefined && hits !== null && hits !== '') {
    hitCount = Number(hits);
  } else if (score !== undefined && score !== null && score !== '') {
    hitCount = Number(score);
  }

  if (hitCount === null || Number.isNaN(hitCount)) return null;

  if (hitCount >= 36) return 'Expert';
  if (hitCount >= 30) return 'Sharpshooter';
  if (hitCount >= 23) return 'Marksman';
  return 'Unqualified';
}
