import { useCallback, useEffect, useLayoutEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  pwaInstallPromptState,
  pwaInstalledState,
  pwaStandaloneState,
} from '@states/app';
import { BeforeInstallPromptEvent } from '@definition/app';
import {
  isInstalledAsRelatedApp,
  isRunningStandalone,
  pwaInstallGuide,
} from '@utils/pwa';

const STANDALONE_QUERY = '(display-mode: standalone)';

// the app remembers being installed: a browser only admits it while running
// as an app, which is never true in the tab the user is reading right now
const INSTALLED_KEY = 'organized_pwa_installed';

const rememberInstalled = () => {
  try {
    localStorage.setItem(INSTALLED_KEY, 'true');
  } catch {
    // a browser with no storage still works, it just asks again
  }
};

export const wasInstalled = () => {
  try {
    return localStorage.getItem(INSTALLED_KEY) === 'true';
  } catch {
    return false;
  }
};

/**
 * Keeps the install prompt state in sync with the browser.
 *
 * Mounted once from the root layout: the listeners live inside a React effect
 * so no code runs outside a React boundary, which the app strict CSP rules
 * require.
 */
export const usePwaInstallListener = () => {
  const setInstallPrompt = useSetAtom(pwaInstallPromptState);
  const setStandalone = useSetAtom(pwaStandaloneState);
  const setInstalled = useSetAtom(pwaInstalledState);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();

      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setStandalone(isRunningStandalone());

      rememberInstalled();
      setInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Chromium fires the prompt once, and for a returning visitor it does so
    // before this effect runs: the script in the document head keeps it
    if (window.deferredInstallPrompt) {
      setInstallPrompt(window.deferredInstallPrompt);
    }

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [setInstallPrompt, setInstalled, setStandalone]);

  // before paint: an installed app would otherwise show the install button
  // for one frame, while the standalone state still holds its initial value
  useLayoutEffect(() => {
    setStandalone(isRunningStandalone());

    if (typeof window.matchMedia !== 'function') return;

    const query = window.matchMedia(STANDALONE_QUERY);

    const handleDisplayModeChange = (event: MediaQueryListEvent) => {
      setStandalone(event.matches);
    };

    query.addEventListener('change', handleDisplayModeChange);

    return () => {
      query.removeEventListener('change', handleDisplayModeChange);
    };
  }, [setStandalone]);

  useLayoutEffect(() => {
    if (wasInstalled()) setInstalled(true);
  }, [setInstalled]);

  useEffect(() => {
    let active = true;

    isInstalledAsRelatedApp().then((installed) => {
      if (!active || !installed) return;

      rememberInstalled();
      setInstalled(true);
    });

    return () => {
      active = false;
    };
  }, [setInstalled]);
};

const usePwaInstall = () => {
  const installPrompt = useAtomValue(pwaInstallPromptState);
  const isStandalone = useAtomValue(pwaStandaloneState);
  const isKnownInstalled = useAtomValue(pwaInstalledState);

  const setInstallPrompt = useSetAtom(pwaInstallPromptState);

  const isInstalled = isStandalone || isKnownInstalled;

  /**
   * Opens the browser's own install prompt.
   *
   * @returns whether the prompt was shown, so the caller can fall back to
   * telling the user where its command lives
   */
  const installPwa = useCallback(async () => {
    if (!installPrompt) return false;

    // the event is good for one call only
    setInstallPrompt(null);
    window.deferredInstallPrompt = null;

    try {
      await installPrompt.prompt();

      const { outcome } = await installPrompt.userChoice;

      if (outcome === 'accepted') rememberInstalled();

      return true;
    } catch {
      return false;
    }
  }, [installPrompt, setInstallPrompt]);

  return {
    /** the browser can install the app without leaving the page */
    hasPrompt: installPrompt !== null,
    isInstalled,
    installPwa,
    guide: pwaInstallGuide(),
  };
};

export default usePwaInstall;
