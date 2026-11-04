import { getAuth } from 'firebase/auth';
import { STORAGE_KEY } from '@constants/index';
import { localStorageGetItem } from '@utils/common';
import { displaySnackNotification } from '@services/states/app';
import { getTranslation } from '@services/i18n/translation';
import { appLockClearPin } from './storage';

// a stale request must not clear the PIN on a later sign-in
const PIN_RESET_VALID_FOR = 60 * 60 * 1000;

type PinResetRequest = { email: string; requested_at: number };

const normalize = (email: string) => email.trim().toLowerCase();

const readRequest = (): PinResetRequest | null => {
  try {
    const stored = localStorageGetItem(STORAGE_KEY.app_lock_pin_reset);
    const request = stored ? (JSON.parse(stored) as PinResetRequest) : null;

    if (request && Date.now() - request.requested_at <= PIN_RESET_VALID_FOR) {
      return request;
    }
  } catch {
    // unreadable marker, dropped below
  }

  appLockClearPinResetRequest();
  return null;
};

export const appLockMarkPinResetRequested = (email: string) => {
  const request: PinResetRequest = {
    email: normalize(email),
    requested_at: Date.now(),
  };

  localStorage.setItem(STORAGE_KEY.app_lock_pin_reset, JSON.stringify(request));
};

export const appLockClearPinResetRequest = () => {
  localStorage.removeItem(STORAGE_KEY.app_lock_pin_reset);
};

export const appLockIsPinResetPending = () => readRequest() !== null;

// call only once the sign-in is complete, MFA included
export const appLockCompletePinReset = () => {
  const request = readRequest();

  if (!request) return;

  appLockClearPinResetRequest();

  // only the account that asked for the reset may clear the PIN
  const email = getAuth().currentUser?.email;

  if (!email || normalize(email) !== request.email) return;

  appLockClearPin({ pin_create_pending: true });

  displaySnackNotification({
    header: getTranslation({ key: 'tr_PINResetDone' }),
    message: getTranslation({ key: 'tr_PINResetDoneDesc' }),
    severity: 'success',
  });
};
