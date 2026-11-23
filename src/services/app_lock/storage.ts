import { store } from '@states/index';
import {
  appLockReadStored,
  appLockSettingsState,
  isAppLockedState,
} from '@states/app_lock';
import { AppLockSettingsType } from '@definition/app_lock';
import { STORAGE_KEY } from '@constants/index';

// keys set to undefined are removed
export const appLockUpdate = (changes: Partial<AppLockSettingsType>) => {
  const next = { ...store.get(appLockSettingsState), ...changes };

  for (const key of Object.keys(changes) as (keyof AppLockSettingsType)[]) {
    if (changes[key] === undefined) delete next[key];
  }

  store.set(appLockSettingsState, next);
  localStorage.setItem(STORAGE_KEY.app_lock, JSON.stringify(next));
};

export const appLockRefresh = () => {
  store.set(appLockSettingsState, appLockReadStored());
};

export const appLockClearPin = (changes?: Partial<AppLockSettingsType>) => {
  appLockUpdate({
    enabled: false,
    biometric_enabled: false,
    failed_attempts: 0,
    locked_until: undefined,
    pin_hash: undefined,
    pin_salt: undefined,
    pin_iterations: undefined,
    webauthn_credential_id: undefined,
    ...changes,
  });

  store.set(isAppLockedState, false);
};
