import { useCallback, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { appLockSettingsState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { displaySnackNotification } from '@services/states/app';
import {
  APP_LOCK_PBKDF2_ITERATIONS,
  generateSalt,
  hashPin,
  verifyPin,
} from '@services/app_lock/crypto';

type Step = 'current' | 'new' | 'confirm';

const useCreatePin = (mode: 'create' | 'change', onClose: VoidFunction) => {
  const { t } = useAppTranslation();
  const appLock = useAtomValue(appLockSettingsState);

  const [step, setStep] = useState<Step>(mode === 'change' ? 'current' : 'new');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const reset = useCallback(() => {
    setStep(mode === 'change' ? 'current' : 'new');
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    setHasError(false);
    setErrorText('');
  }, [mode]);

  const handlePinChange = (value: string) => {
    setHasError(false);
    setErrorText('');
    if (step === 'current') setCurrentPin(value);
    else if (step === 'new') setNewPin(value);
    else setConfirmPin(value);
  };

  const handleContinue = async () => {
    if (isProcessing) return;

    if (step === 'current') {
      if (!appLock?.pin_hash || !appLock?.pin_salt) return;
      setIsProcessing(true);
      const ok = await verifyPin(
        currentPin,
        appLock.pin_hash,
        appLock.pin_salt,
        appLock.pin_iterations ?? APP_LOCK_PBKDF2_ITERATIONS
      );
      setIsProcessing(false);

      if (!ok) {
        setHasError(true);
        setErrorText(t('tr_wrongPINTryAgain'));
        setCurrentPin('');
        return;
      }
      setStep('new');
      return;
    }

    if (step === 'new') {
      setStep('confirm');
      return;
    }

    if (step === 'confirm') {
      if (confirmPin !== newPin) {
        setHasError(true);
        setErrorText(t('tr_pinMismatch'));
        setConfirmPin('');
        setNewPin('');
        setStep('new');
        return;
      }

      setIsProcessing(true);
      try {
        const salt = generateSalt();
        const hash = await hashPin(newPin, salt);
        const now = new Date().toISOString();

        await dbAppSettingsUpdate({
          'user_settings.app_lock.enabled': { value: true, updatedAt: now },
          'user_settings.app_lock.pin_hash': hash,
          'user_settings.app_lock.pin_salt': salt,
          'user_settings.app_lock.pin_iterations': APP_LOCK_PBKDF2_ITERATIONS,
        });

        displaySnackNotification({
          header: t('tr_PINNewSet'),
          message: t('tr_PINNewSetDesc'),
          severity: 'success',
        });

        onClose();
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const currentValue =
    step === 'current' ? currentPin : step === 'new' ? newPin : confirmPin;

  const title =
    step === 'current'
      ? t('tr_changePIN')
      : step === 'new' && mode === 'change'
        ? t('tr_createNewPIN')
        : step === 'new'
          ? t('tr_PINCreate')
          : t('tr_PINConfirm');

  const description =
    step === 'current'
      ? t('tr_enterCurrentPIN')
      : step === 'new' && mode === 'change'
        ? t('tr_createNewPINDesc')
        : step === 'new'
          ? t('tr_PINCreateDesc')
          : t('tr_PINConfirmDesc');

  const continueLabel =
    step === 'confirm' ? t('tr_PINSet') : t('tr_continue');

  return {
    step,
    title,
    description,
    currentValue,
    continueLabel,
    hasError,
    errorText,
    isProcessing,
    handlePinChange,
    handleContinue,
    reset,
  };
};

export default useCreatePin;
