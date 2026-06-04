/**
 * Open an external URL (Capacitor Browser can be wired here later on native).
 */
export function openExternalUrl(url) {
  if (typeof window === 'undefined' || !url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
}
