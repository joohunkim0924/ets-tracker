import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Android system back: one step in-app history, exit only at the root screen.
 */
export default function AndroidBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
      return undefined;
    }

    const listenerPromise = App.addListener('backButton', ({ canGoBack }) => {
      const openDialog = document.querySelector('[role="dialog"][data-state="open"]');
      if (openDialog) {
        const closeBtn = openDialog.querySelector('[data-radix-dialog-close], button[aria-label="Close"], button[aria-label="close"]');
        if (closeBtn instanceof HTMLElement) {
          closeBtn.click();
          return;
        }
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        return;
      }

      if (canGoBack && location.pathname !== '/') {
        navigate(-1);
        return;
      }

      if (location.pathname !== '/') {
        navigate('/', { replace: true });
        return;
      }

      App.exitApp();
    });

    return () => {
      listenerPromise.then((listener) => listener.remove());
    };
  }, [location.pathname, navigate]);

  return null;
}
