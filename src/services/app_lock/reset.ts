import { STORAGE_KEY } from '@constants/index';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { localStorageGetItem } from '@utils/common';

/**
 * The forgot-PIN flow signs the user in again through the passwordless email
 * link, which can land in a new tab or after a cold start. The pending request
 * is therefore kept on the device instead of in memory.
 */
export const appLockMarkPinResetRequested = () => {
  if (typeof localStorage === 'undefined') return;

  localStorage.setItem(
    STORAGE_KEY.app_lock_pin_reset,
    new Date().toISOString()
  );
};

export const appLockIsPinResetPending = () => {
  return !!localStorageGetItem(STORAGE_KEY.app_lock_pin_reset);
};

export const appLockClearPinResetRequest = () => {
  if (typeof localStorage === 'undefined') return;

  localStorage.removeItem(STORAGE_KEY.app_lock_pin_reset);
};

/**
 * Removes the forgotten PIN and every credential derived from it, so the app
 * opens unlocked and a new PIN can be created.
 */
export const appLockResetPin = async () => {
  const now = new Date().toISOString();

  await dbAppSettingsUpdate({
    'user_settings.app_lock.enabled': { value: false, updatedAt: now },
    'user_settings.app_lock.pin_hash': undefined,
    'user_settings.app_lock.pin_salt': undefined,
    'user_settings.app_lock.pin_iterations': undefined,
    'user_settings.app_lock.biometric_enabled': {
      value: false,
      updatedAt: now,
    },
    'user_settings.app_lock.webauthn_credential_id': undefined,
  });

  appLockClearPinResetRequest();
};
