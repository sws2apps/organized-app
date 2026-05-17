import { useEffect, useState, useCallback } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

let cachedPrompt: BeforeInstallPromptEvent | null =
  typeof window !== 'undefined'
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (((window as any).deferredPrompt as BeforeInstallPromptEvent) || null)
    : null;

const listeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    cachedPrompt = e as BeforeInstallPromptEvent;
    listeners.forEach((listener) => listener());
  });

  window.addEventListener('appinstalled', () => {
    cachedPrompt = null;
    listeners.forEach((listener) => listener());
  });
}

const usePwaInstall = () => {
  const [isPwaInstallable, setIsPwaInstallable] = useState(
    () =>
      cachedPrompt !== null &&
      !window.matchMedia('(display-mode: standalone)').matches
  );

  useEffect(() => {
    const updateState = () => {
      setIsPwaInstallable(
        cachedPrompt !== null &&
          !window.matchMedia('(display-mode: standalone)').matches
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
