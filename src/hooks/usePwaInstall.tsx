import { useCallback, useEffect, useLayoutEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { pwaInstallPromptState, pwaStandaloneState } from '@states/app';
import { BeforeInstallPromptEvent } from '@definition/app';

const STANDALONE_QUERY = '(display-mode: standalone)';

const isStandaloneDisplay = () => {
  if (typeof window === 'undefined') return false;

  if (typeof window.matchMedia === 'function') {
    return window.matchMedia(STANDALONE_QUERY).matches;
  }

  return false;
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

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();

      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setStandalone(isStandaloneDisplay());
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [setInstallPrompt, setStandalone]);

  // before paint: an installed app would otherwise show the install button
  // for one frame, while the standalone state still holds its initial value
  useLayoutEffect(() => {
    setStandalone(isStandaloneDisplay());

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
};

const usePwaInstall = () => {
  const installPrompt = useAtomValue(pwaInstallPromptState);
  const isStandalone = useAtomValue(pwaStandaloneState);

  const setInstallPrompt = useSetAtom(pwaInstallPromptState);

  const isPwaInstallable = installPrompt !== null && !isStandalone;

  const installPwa = useCallback(async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();

    const { outcome } = await installPrompt.userChoice;

    // a dismissed prompt can be shown again, an accepted one cannot
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  }, [installPrompt, setInstallPrompt]);

  return { isPwaInstallable, installPwa, isStandalone };
};

export default usePwaInstall;
