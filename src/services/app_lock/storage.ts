import { atom } from 'jotai';
import { store } from '@states/index';
import { AppLockSettingsType } from '@definition/settings';
import { STORAGE_KEY } from '@constants/index';

/**
 * The app lock belongs to the device, not to the user.
 *
 * The PIN and the credential derived from it never leave the browser they were
 * created in: they are kept here rather than in the congregation settings, so
 * that nothing about the lock is carried by synchronization or by an export.
 * A user who locks one device therefore leaves the others as they were.
 */
const DEFAULTS: AppLockSettingsType = {
  enabled: { value: false, updatedAt: '' },
  lock_after_minutes: { value: 5, updatedAt: '' },
  biometric_enabled: { value: false, updatedAt: '' },
  pin_create_pending: { value: false, updatedAt: '' },
};

const readStored = (): AppLockSettingsType => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY.app_lock);

    if (!stored) return { ...DEFAULTS };

    return { ...DEFAULTS, ...JSON.parse(stored) };
  } catch {
    // a browser with no storage, or a value another version wrote, locks nothing
    return { ...DEFAULTS };
  }
};

const writeStored = (value: AppLockSettingsType) => {
  try {
    localStorage.setItem(STORAGE_KEY.app_lock, JSON.stringify(value));
  } catch {
    // nothing can be kept on this device, so the lock stays off
  }
};

export const appLockState = atom(readStored());

/**
 * Applies a change to the lock of this device.
 *
 * A key set to `undefined` is dropped, which is how a PIN and its credentials
 * are removed.
 */
export const appLockUpdate = (changes: Partial<AppLockSettingsType>) => {
  const current = store.get(appLockState);

  const next = { ...current, ...changes } as AppLockSettingsType;

  const keys = Object.keys(changes) as (keyof AppLockSettingsType)[];

  for (const key of keys) {
    if (changes[key] === undefined) delete next[key];
  }

  store.set(appLockState, next);
  writeStored(next);

  return next;
};

/** Reads what another tab of this device wrote. */
export const appLockRefresh = () => {
  store.set(appLockState, readStored());
};
