// Theme definitions - each has a primary color (hsl values) and a name
export const THEMES = [
  { id: 'purple',      label: 'Purple',        primary: '270 60% 52%', accent: '280 90% 65%' },
  { id: 'army-green',  label: 'Army Green',    primary: '142 55% 38%', accent: '43 96% 50%' },
  { id: 'midnight',    label: 'Midnight Blue', primary: '220 70% 45%', accent: '43 96% 50%' },
  { id: 'ranger-tan',  label: 'Ranger Tan',    primary: '35 55% 40%',  accent: '43 96% 50%' },
  { id: 'ranger-red',  label: 'Ranger Red',    primary: '0 65% 45%',   accent: '43 96% 50%' },
  { id: 'airborne',    label: 'Airborne',      primary: '270 55% 45%', accent: '280 90% 65%' },
  { id: 'sf-grey',     label: 'SF Grey',       primary: '220 15% 40%', accent: '43 96% 50%' },
];

const STORAGE_KEY = 'aft-tracker-theme';

export function applyTheme(themeId) {
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const root = document.documentElement;
  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--ring', theme.primary);
  root.style.setProperty('--sidebar-primary', theme.primary);
  root.style.setProperty('--sidebar-ring', theme.primary);
  root.style.setProperty('--chart-1', theme.primary);
  root.style.setProperty('--accent', theme.accent);
  localStorage.setItem(STORAGE_KEY, themeId);
}

export function getSavedTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved || saved === 'army-green') return 'purple';
  return saved;
}
