import { useCallback, useState } from 'react';
import { useAtomValue } from 'jotai';
import { TFunction } from 'i18next';
import { useAppTranslation } from '@hooks/index';
import { appLockSettingsState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import {
  APP_LOCK_PBKDF2_ITERATIONS,
  generateSalt,
  hashPin,
  verifyPin,
} from '@services/app_lock/crypto';

type Step = 'current' | 'new' | 'confirm';
type Mode = 'create' | 'change' | 'disable';

const PIN_PATTERN = /^\d{4}$/;

const initialStep = (mode: Mode): Step =>
  mode === 'create' ? 'new' : 'current';

const getStepLabels = (
  step: Step,
  mode: Mode,
  t: TFunction
): { title: string; description: string } => {
  if (step === 'current') {
    if (mode === 'disable') {
      return {
        title: t('tr_disableAppLock'),
        description: t('tr_enterCurrentPIN'),
      };
    }
    return {
      title: t('tr_changePIN'),
      description: t('tr_enterCurrentPIN'),
    };
  }
  if (step === 'new') {
    return mode === 'change'
      ? { title: t('tr_createNewPIN'), description: t('tr_createNewPINDesc') }
      : { title: t('tr_PINCreate'), description: t('tr_PINCreateDesc') };
  }
  return { title: t('tr_PINConfirm'), description: t('tr_PINConfirmDesc') };
};

const useCreatePin = (mode: Mode, onClose: VoidFunction) => {
  const { t } = useAppTranslation();
  const appLock = useAtomValue(appLockSettingsState);

  const [step, setStep] = useState<Step>(initialStep(mode));
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const reset = useCallback(() => {
    setStep(initialStep(mode));
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    setHasError(false);
    setErrorText('');
  }, [mode]);

  const showError = (message: string) => {
    setHasError(true);
    setErrorText(message);
  };

  const clearError = () => {
    setHasError(false);
    setErrorText('');
  };

  const pinSetters: Record<Step, (value: string) => void> = {
    current: setCurrentPin,
    new: setNewPin,
    confirm: setConfirmPin,
  };

  const handlePinChange = (value: string) => {
    clearError();
    pinSetters[step](value);
  };

  const verifyCurrentPin = async (): Promise<boolean> => {
    if (!appLock?.pin_hash || !appLock?.pin_salt) return false;
    setIsProcessing(true);
    try {
      return await verifyPin(
        currentPin,
        appLock.pin_hash,
        appLock.pin_salt,
        appLock.pin_iterations ?? APP_LOCK_PBKDF2_ITERATIONS
      );
    } catch {
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const persistNewPin = async () => {
    if (!PIN_PATTERN.test(newPin)) return;
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
    } catch (error) {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(
          error instanceof Error ? error.message : ''
        ),
        severity: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const disableAppLock = async () => {
    setIsProcessing(true);
    try {
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
      onClose();
    } catch (error) {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(
          error instanceof Error ? error.message : ''
        ),
        severity: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCurrentStep = async () => {
    const ok = await verifyCurrentPin();
    if (ok) {
      if (mode === 'disable') {
        await disableAppLock();
        return;
      }
      setStep('new');
      return;
    }
    showError(t('tr_wrongPINTryAgain'));
    setCurrentPin('');
  };

  const handleConfirmStep = async () => {
    if (confirmPin === newPin) {
      await persistNewPin();
      return;
    }
    showError(t('tr_pinMismatch'));
    setConfirmPin('');
    setNewPin('');
    setStep('new');
  };

  const handleContinue = async () => {
    if (isProcessing) return;
    if (step === 'current') return handleCurrentStep();
    if (step === 'new') {
      if (!PIN_PATTERN.test(newPin)) return;
      setStep('confirm');
      return;
    }
    return handleConfirmStep();
  };

  const pinValues: Record<Step, string> = {
    current: currentPin,
    new: newPin,
    confirm: confirmPin,
  };

  const { title, description } = getStepLabels(step, mode, t);

  let continueLabel = t('tr_continue');
  if (mode === 'disable') {
    continueLabel = t('tr_disable');
  } else if (step === 'confirm') {
    continueLabel = t('tr_PINSet');
  }

  return {
    step,
    title,
    description,
    currentValue: pinValues[step],
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
