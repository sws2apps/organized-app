import { useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  appLockSettingsState,
  appLockBiometricEnabledState,
} from '@states/settings';
import {
  appLockViewState,
  appLockWrongAttemptState,
  isAppLockedState,
} from '@states/app_lock';
import {
  APP_LOCK_PBKDF2_ITERATIONS,
  verifyPin,
} from '@services/app_lock/crypto';
import { verifyBiometric } from '@services/app_lock/webauthn';

const PIN_LENGTH = 4;

const useUnlockScreen = () => {
  const appLock = useAtomValue(appLockSettingsState);
  const biometricEnabled = useAtomValue(appLockBiometricEnabledState);

  const setIsLocked = useSetAtom(isAppLockedState);
  const setView = useSetAtom(appLockViewState);
  const [hasError, setHasError] = useAtom(appLockWrongAttemptState);

  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const reset = () => {
    setPin('');
    setHasError(false);
  };

  const handlePinChange = (value: string) => {
    if (hasError) setHasError(false);
    setPin(value);
  };

  const handleUnlock = async (completed?: string) => {
    if (!appLock?.pin_hash || !appLock?.pin_salt) return;
    if (isProcessing) return;

    const pinToCheck = completed ?? pin;
    if (pinToCheck.length < PIN_LENGTH) return;

    setIsProcessing(true);
    const ok = await verifyPin(
      pinToCheck,
      appLock.pin_hash,
      appLock.pin_salt,
      appLock.pin_iterations ?? APP_LOCK_PBKDF2_ITERATIONS
    );
    setIsProcessing(false);

    if (ok) {
      setIsLocked(false);
      setHasError(false);
      setPin('');
      return;
    }

    setHasError(true);
    setPin('');
  };

  const handleBiometric = async () => {
    if (!appLock?.webauthn_credential_id) return;
    if (isProcessing) return;

    setIsProcessing(true);
    const ok = await verifyBiometric(appLock.webauthn_credential_id);
    setIsProcessing(false);

    if (ok) {
      setIsLocked(false);
      setHasError(false);
      setPin('');
    }
  };

  const handleForgot = () => {
    reset();
    setView('forgot');
  };

  return {
    pin,
    pinLength: PIN_LENGTH,
    isProcessing,
    hasError,
    biometricEnabled,
    handlePinChange,
    handleUnlock,
    handleBiometric,
    handleForgot,
  };
};

export default useUnlockScreen;
