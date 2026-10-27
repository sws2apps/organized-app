import { atom } from 'jotai';
import { AppLockSettingsType, AppLockView } from '@definition/app_lock';
import { STORAGE_KEY } from '@constants/index';
import { localStorageGetItem } from '@utils/common';

const APP_LOCK_DEFAULTS: AppLockSettingsType = {
  enabled: false,
  lock_after_minutes: 5,
  biometric_enabled: false,
  pin_create_pending: false,
  failed_attempts: 0,
};

export const appLockReadStored = (): AppLockSettingsType => {
  try {
    const stored = localStorageGetItem(STORAGE_KEY.app_lock);

    return { ...APP_LOCK_DEFAULTS, ...(stored ? JSON.parse(stored) : {}) };
  } catch {
    return { ...APP_LOCK_DEFAULTS };
  }
};

const stored = appLockReadStored();

// device-local: never synced or included in backups
export const appLockSettingsState = atom(stored);

export const appLockHasPinState = atom((get) => {
  const { pin_hash, pin_salt } = get(appLockSettingsState);

  return !!pin_hash && !!pin_salt;
});

export const appLockEnabledState = atom(
  (get) => get(appLockSettingsState).enabled && get(appLockHasPinState)
);

export const appLockBiometricEnabledState = atom((get) => {
  const { biometric_enabled, webauthn_credential_id } =
    get(appLockSettingsState);

  return biometric_enabled && !!webauthn_credential_id;
});

// an existing PIN overrides a stale pending flag
export const appLockNeedsPinState = atom(
  (get) =>
    get(appLockSettingsState).pin_create_pending && !get(appLockHasPinState)
);

// every start opens locked, so the app never shows before the PIN
export const isAppLockedState = atom(
  stored.enabled && !!stored.pin_hash && !!stored.pin_salt
);

export const appLockViewState = atom<AppLockView>('unlock');
