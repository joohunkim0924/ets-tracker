/** App is dark-mode only. Ensures .dark class is set for Tailwind dark: variants. */
export function applyAppTheme() {
  document.documentElement.classList.add('dark');
}
