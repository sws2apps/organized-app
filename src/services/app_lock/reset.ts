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

export const appLockClearPinResetRequest = () => {
  if (typeof localStorage === 'undefined') return;

  localStorage.removeItem(STORAGE_KEY.app_lock_pin_reset);
};

// a request the user never followed through on must not clear the PIN days
// later, when the same device signs in through an email link for any reason
const PIN_RESET_VALID_FOR = 60 * 60 * 1000;

export const appLockIsPinResetPending = () => {
  const requestedAt = localStorageGetItem(STORAGE_KEY.app_lock_pin_reset);

  if (!requestedAt) return false;

  const elapsed = Date.now() - new Date(requestedAt).getTime();

  if (Number.isNaN(elapsed) || elapsed > PIN_RESET_VALID_FOR) {
    appLockClearPinResetRequest();
    return false;
  }

  return true;
};

/**
 * Removes the forgotten PIN and every credential derived from it, so the app
 * opens unlocked and a new PIN can be created.
 *
 * The request for a new PIN is stored with the settings rather than on the
 * device: the lock is off until it is answered, and that has to hold in every
 * tab and after any reload, whatever the browser storage was cleared of.
 */
export const appLockResetPin = async () => {
  const now = new Date().toISOString();

  await dbAppSettingsUpdate({
    'user_settings.app_lock.enabled': { value: false, updatedAt: now },
    'user_settings.app_lock.pin_create_pending': {
      value: true,
      updatedAt: now,
    },
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

export const appLockClearPinCreateRequest = async () => {
  await dbAppSettingsUpdate({
    'user_settings.app_lock.pin_create_pending': {
      value: false,
      updatedAt: new Date().toISOString(),
    },
  });
};
