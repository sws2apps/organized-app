import { getApp } from 'firebase/app';
import { getId, getInstallations } from 'firebase/installations';

let cachedInstallationId: string | undefined;

/**
 * Stable per-install identifier of this app copy. Sent with the account check
 * and with sign-in so the server can recognise this device even when its
 * session cookie has been dropped by the browser.
 */
export const getAppInstallationId = async () => {
  if (cachedInstallationId) return cachedInstallationId;

  try {
    if (import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST) {
      // the installations service has no emulator; keep the same stand-in id
      // the feature flags use in that setup
      cachedInstallationId = 'ad00115e-46da-476c-a7bf-d160b4eaa1e6';
    } else {
      cachedInstallationId = await getId(getInstallations(getApp()));
    }
  } catch {
    cachedInstallationId = undefined;
  }

  return cachedInstallationId;
};
