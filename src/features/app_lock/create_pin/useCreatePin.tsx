import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { appLockSettingsState } from '@states/app_lock';
import { APP_LOCK_PIN_LENGTH } from '@constants/index';
import { appLockClearPin, appLockUpdate } from '@services/app_lock/storage';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import {
  APP_LOCK_PBKDF2_ITERATIONS,
  generateSalt,
  hashPin,
  verifyPin,
} from '@services/app_lock/crypto';

export type CreatePinMode = 'create' | 'change' | 'disable';

type Step = 'current' | 'new' | 'confirm';

const useCreatePin = (mode: CreatePinMode, onDone: VoidFunction) => {
  const { t } = useAppTranslation();

  const appLock = useAtomValue(appLockSettingsState);

  const [step, setStep] = useState<Step>(mode === 'create' ? 'new' : 'current');
  const [value, setValue] = useState('');
  const [newPin, setNewPin] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const goTo = (next: Step, error = '') => {
    setStep(next);
    setValue('');
    setErrorText(error);
  };

  const showError = (error: unknown) => {
    displaySnackNotification({
      header: getMessageByCode('error_app_generic-title'),
      message: getMessageByCode((error as Error).message),
      severity: 'error',
    });
  };

  const verifyCurrentPin = async (pin: string) => {
    const { pin_hash, pin_salt, pin_iterations } = appLock;

    if (!pin_hash || !pin_salt) return false;

    return verifyPin(pin, pin_hash, pin_salt, pin_iterations).catch(
      () => false
    );
  };

  const saveNewPin = async (pin: string) => {
    const salt = generateSalt();

    appLockUpdate({
      enabled: true,
      pin_create_pending: false,
      failed_attempts: 0,
      locked_until: undefined,
      pin_hash: await hashPin(pin, salt),
      pin_salt: salt,
      pin_iterations: APP_LOCK_PBKDF2_ITERATIONS,
    });

    displaySnackNotification({
      header: t('tr_PINNewSet'),
      message: t('tr_PINNewSetDesc'),
      severity: 'success',
    });
  };

  const disableAppLock = () => {
    appLockClearPin();

    displaySnackNotification({
      header: t('tr_appLockOff'),
      message: t('tr_appLockOffDesc'),
      severity: 'success',
    });
  };

  const handlePinChange = (pin: string) => {
    setErrorText('');
    setValue(pin);
  };

  const handleContinue = async (pin = value) => {
    if (isProcessing || pin.length < APP_LOCK_PIN_LENGTH) return;

    if (step === 'new') {
      setNewPin(pin);
      goTo('confirm');
      return;
    }

    setIsProcessing(true);

    try {
      if (step === 'current') {
        if (!(await verifyCurrentPin(pin))) {
          goTo('current', t('tr_PINWrong'));
          return;
        }

        if (mode === 'disable') {
          disableAppLock();
          onDone();
          return;
        }

        goTo('new');
        return;
      }

      if (pin !== newPin) {
        goTo('new', t('tr_PINMismatch'));
        return;
      }

      await saveNewPin(pin);
      onDone();
    } catch (error) {
      showError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  let title = t('tr_PINConfirm');
  let description = t('tr_PINConfirmDesc');

  if (step === 'current') {
    title = mode === 'disable' ? t('tr_appLockDisable') : t('tr_PINChange');
    description = t('tr_PINEnterCurrent');
  }

  if (step === 'new' && mode === 'change') {
    title = t('tr_PINCreateNew');
    description = t('tr_PINCreateNewDesc');
  }

  if (step === 'new' && mode !== 'change') {
    title = t('tr_PINCreate');
    description = t('tr_PINCreateDesc');
  }

  let continueLabel = t('tr_continue');
  if (step === 'current' && mode === 'disable') continueLabel = t('tr_disable');
  if (step === 'confirm') continueLabel = t('tr_PINSet');

  return {
    step,
    title,
    description,
    value,
    errorText,
    continueLabel,
    isProcessing,
    handlePinChange,
    handleContinue,
  };
};

export default useCreatePin;
