import { useEffect, useState, useCallback } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

let cachedPrompt: BeforeInstallPromptEvent | null =
  typeof globalThis === 'undefined'
    ? null
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (((globalThis as any).deferredPrompt as BeforeInstallPromptEvent) || null);

const listeners = new Set<() => void>();

if (typeof globalThis !== 'undefined') {
  globalThis.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    cachedPrompt = e as BeforeInstallPromptEvent;
    listeners.forEach((listener) => listener());
  });

  globalThis.addEventListener('appinstalled', () => {
    cachedPrompt = null;
    listeners.forEach((listener) => listener());
  });
}

const usePwaInstall = () => {
  const [isPwaInstallable, setIsPwaInstallable] = useState(
    () =>
      cachedPrompt !== null &&
      !globalThis.matchMedia('(display-mode: standalone)').matches
  );

  useEffect(() => {
    const updateState = () => {
      setIsPwaInstallable(
        cachedPrompt !== null &&
          !globalThis.matchMedia('(display-mode: standalone)').matches
      );
    };

    updateState();

    listeners.add(updateState);
    return () => {
      listeners.delete(updateState);
    };
  }, []);

  const installPwa = useCallback(async () => {
    const prompt = cachedPrompt;
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') {
      cachedPrompt = null;
      listeners.forEach((listener) => listener());
    }
  }, []);

  return { isPwaInstallable, installPwa };
};

export default usePwaInstall;
