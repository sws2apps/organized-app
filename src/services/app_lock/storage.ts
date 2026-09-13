import { atom } from 'jotai';
import { store } from '@states/index';
import { AppLockSettingsType } from '@definition/settings';
import { STORAGE_KEY } from '@constants/index';

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
    return { ...DEFAULTS };
  }
};

const writeStored = (value: AppLockSettingsType) => {
  try {
    localStorage.setItem(STORAGE_KEY.app_lock, JSON.stringify(value));
  } catch {
    return;
  }
};

/** The app lock is device-local: it is never synced or exported. */
export const appLockState = atom(readStored());

/** Keys set to `undefined` are removed. */
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

/** Picks up changes made in another tab. */
export const appLockRefresh = () => {
  store.set(appLockState, readStored());
};
