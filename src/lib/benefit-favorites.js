const STORAGE_KEY = 'ets-tracker:benefit-favorites';

export function getFavoriteIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return [];
}

export function saveFavoriteIds(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent('benefit-favorites-updated'));
}

export function isFavorite(id) {
  return getFavoriteIds().includes(id);
}

export function toggleFavorite(id) {
  const ids = getFavoriteIds();
  const next = ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id];
  saveFavoriteIds(next);
  return next;
}
