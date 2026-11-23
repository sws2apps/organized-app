import { useEffect, useRef, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import {
  appLockBiometricEnabledState,
  appLockSettingsState,
  appLockViewState,
  isAppLockedState,
} from '@states/app_lock';
import { APP_LOCK_PIN_LENGTH } from '@constants/index';
import { verifyPin } from '@services/app_lock/crypto';
import { verifyBiometric } from '@services/app_lock/webauthn';
import { appLockClearPinResetRequest } from '@services/app_lock/reset';
import {
  appLockRecordFailedAttempt,
  appLockResetAttempts,
} from '@services/app_lock/attempts';
import { PinInputHandle } from '../pin_input';
import useCooldown from './useCooldown';

const formatSeconds = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

const useUnlockScreen = () => {
  const { t } = useAppTranslation();

  const appLock = useAtomValue(appLockSettingsState);
  const biometricEnabled = useAtomValue(appLockBiometricEnabledState);
  const setIsLocked = useSetAtom(isAppLockedState);
  const setView = useSetAtom(appLockViewState);

  const pinRef = useRef<PinInputHandle>(null);

  const [pin, setPin] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const cooldownLeft = useCooldown(appLock.locked_until);
  const isCoolingDown = cooldownLeft > 0;

  const wasCoolingDown = useRef(isCoolingDown);

  useEffect(() => {
    // the cells were disabled, so the focus has to come back
    if (wasCoolingDown.current && !isCoolingDown) pinRef.current?.focus();

    wasCoolingDown.current = isCoolingDown;
  }, [isCoolingDown]);

  // a correct PIN also cancels a pending reset link
  const unlock = () => {
    appLockResetAttempts();
    appLockClearPinResetRequest();
    setIsLocked(false);
    setPin('');
    setHasError(false);
  };

  const handlePinChange = (value: string) => {
    setHasError(false);
    setPin(value);
  };

  const handleUnlock = async (value = pin) => {
    const { pin_hash, pin_salt, pin_iterations } = appLock;

    if (!pin_hash || !pin_salt) return;
    if (isProcessing || isCoolingDown) return;
    if (value.length < APP_LOCK_PIN_LENGTH) return;

    setIsProcessing(true);

    const isValid = await verifyPin(
      value,
      pin_hash,
      pin_salt,
      pin_iterations
    ).catch(() => false);

    setIsProcessing(false);

    if (isValid) {
      unlock();
      return;
    }

    appLockRecordFailedAttempt();
    setHasError(true);
    setPin('');
  };

  const handleBiometric = async () => {
    if (!appLock.webauthn_credential_id || isProcessing) return;

    setIsProcessing(true);
    const isValid = await verifyBiometric(appLock.webauthn_credential_id);
    setIsProcessing(false);

    if (isValid) unlock();
  };

  const handleForgot = () => setView('forgot');

  let helperText = '';
  if (isCoolingDown) helperText = t('tr_PINTooManyAttempts');
  else if (hasError) helperText = t('tr_PINWrong');

  const unlockLabel = isCoolingDown
    ? t('tr_PINTryAgainIn', { time: formatSeconds(cooldownLeft) })
    : t('tr_appLockUnlock');

  return {
    pinRef,
    pin,
    hasError: hasError || isCoolingDown,
    helperText,
    unlockLabel,
    isProcessing,
    isCoolingDown,
    biometricEnabled,
    handlePinChange,
    handleUnlock,
    handleBiometric,
    handleForgot,
  };
};

export default useUnlockScreen;
