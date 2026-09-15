import { STORAGE_KEY } from '@constants/index';
import { localStorageGetItem } from '@utils/common';
import { appLockUpdate } from './storage';

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

// a stale request must not clear the PIN on a later email sign-in
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

/** Removes the PIN and every credential derived from it on this device. */
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
