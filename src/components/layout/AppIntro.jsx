import { useEffect, useState } from 'react';

const INTRO_REVEAL_MS = 3900;
const INTRO_DONE_MS = 4000;

export default function AppIntro({ children }) {
  const [showIntro, setShowIntro] = useState(true);
  const [revealApp, setRevealApp] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setRevealApp(true);
      setShowIntro(false);
      return undefined;
    }

    const revealTimer = window.setTimeout(() => setRevealApp(true), INTRO_REVEAL_MS);
    const doneTimer = window.setTimeout(() => setShowIntro(false), INTRO_DONE_MS);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  return (
    <>
      <div className={`app-intro-content ${revealApp ? 'app-intro-content--ready' : ''}`}>
        {children}
      </div>

      {showIntro && (
        <div className="app-intro" aria-label="Hooah opening animation" aria-live="polite">
          <div className="app-intro__burst" aria-hidden="true" />
          <div className="app-intro__bubble" role="img" aria-label="Hooah company logo">
            <span>Hooah!</span>
          </div>
        </div>
      )}
    </>
  );
}
