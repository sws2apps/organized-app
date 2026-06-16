import { useEffect, useState, useCallback } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

let cachedPrompt: BeforeInstallPromptEvent | null =
  typeof globalThis === 'undefined'
    ? null
    : ((globalThis.deferredPrompt as BeforeInstallPromptEvent) ?? null);

const listeners = new Set<() => void>();

if (typeof globalThis !== 'undefined') {
  globalThis.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    cachedPrompt = e as BeforeInstallPromptEvent;
    listeners.forEach((fn) => fn());
  });

  globalThis.addEventListener('appinstalled', () => {
    cachedPrompt = null;
    listeners.forEach((fn) => fn());
  });
}

const isStandalone = () =>
  globalThis.matchMedia('(display-mode: standalone)').matches;

const usePwaInstall = () => {
  const [isPwaInstallable, setIsPwaInstallable] = useState(
    () => cachedPrompt !== null && !isStandalone()
  );

  useEffect(() => {
    const sync = () => {
      setIsPwaInstallable(cachedPrompt !== null && !isStandalone());
    };

    sync();
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
  }, []);

  const installPwa = useCallback(async () => {
    const prompt = cachedPrompt;
    if (!prompt) return;

    await prompt.prompt();
    const { outcome } = await prompt.userChoice;

    if (outcome === 'accepted') {
      cachedPrompt = null;
      listeners.forEach((fn) => fn());
    }
  }, []);

  return { isPwaInstallable, installPwa, isStandalone: isStandalone() };
};

export default usePwaInstall;
