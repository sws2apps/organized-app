import { BeforeInstallPromptEvent } from '@definition/app';

declare global {
  interface Window {
    /** set by public/pwa-install.js, which runs before the app is mounted */
    deferredInstallPrompt: BeforeInstallPromptEvent | null;
  }
}

export {};
