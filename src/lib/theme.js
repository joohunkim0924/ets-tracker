const STORAGE_KEY = 'aft-tracker-color-mode';
const DEFAULT_MODE = 'light';

const DARK_LEGACY_IDS = new Set(['midnight', 'sf-grey', 'dark']);

export function applyColorMode(mode) {
  const resolved = mode === 'dark' ? 'dark' : 'light';
  document.documentElement.classList.toggle('dark', resolved === 'dark');
  localStorage.setItem(STORAGE_KEY, resolved);
}

export function getSavedColorMode() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;

  // Migrate legacy color-theme ids
  const legacy = localStorage.getItem('aft-tracker-theme');
  if (legacy === 'dark') return 'dark';
  if (legacy && DARK_LEGACY_IDS.has(legacy)) return 'dark';
  return DEFAULT_MODE;
}

/** @deprecated use applyColorMode */
export const applyTheme = applyColorMode;

/** @deprecated use getSavedColorMode */
export const getSavedTheme = getSavedColorMode;
