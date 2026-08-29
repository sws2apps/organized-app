import { STORAGE_KEY } from '@constants/index';
import { localStorageGetItem } from '@utils/common';
import { appLockUpdate } from './storage';

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
 * The lock belongs to this device, so a reset clears this device. The request
 * for a new PIN is kept with it, which holds in every tab and after a reload.
 */
export const appLockResetPin = async () => {
  const now = new Date().toISOString();

  appLockUpdate({
    enabled: { value: false, updatedAt: now },
    pin_create_pending: { value: true, updatedAt: now },
    pin_hash: undefined,
    pin_salt: undefined,
    pin_iterations: undefined,
    biometric_enabled: { value: false, updatedAt: now },
    webauthn_credential_id: undefined,
  });

  appLockClearPinResetRequest();
};

export const appLockClearPinCreateRequest = async () => {
  appLockUpdate({
    pin_create_pending: { value: false, updatedAt: new Date().toISOString() },
  });
};
