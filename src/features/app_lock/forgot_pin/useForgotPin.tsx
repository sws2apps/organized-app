import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import useFirebaseAuth from '@hooks/useFirebaseAuth';
import { appLockViewState } from '@states/app_lock';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { apiRequestPasswordlesssLink } from '@services/api/user';
import { appLockMarkPinResetRequested } from '@services/app_lock/reset';

const useForgotPin = () => {
  const { t } = useAppTranslation();
  const { user } = useFirebaseAuth();
  const savedEmail = user?.email || '';
  const setView = useSetAtom(appLockViewState);

  const [email, setEmail] = useState(savedEmail || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleEmailChange = (value: string) => {
    if (hasError) setHasError(false);
    setEmail(value);
  };

  const handleBack = () => setView('unlock');

  const handleResetPin = async () => {
    if (isProcessing) return;
    if (!email || email.trim().length === 0) return;

    const registered = savedEmail.trim().toLowerCase();
    if (registered && email.trim().toLowerCase() !== registered) {
      setHasError(true);
      return;
    }

    setIsProcessing(true);
    try {
      const result = await apiRequestPasswordlesssLink(email.trim());

      if (result.status === 200) {
        // the link can be opened in another tab or after a cold start, so the
        // pending reset has to survive this session
        appLockMarkPinResetRequested();

        displaySnackNotification({
          header: t('tr_resetPIN'),
          message: t('tr_forgotPINEmailSent'),
          severity: 'success',
        });
        setView('unlock');
        return;
      }

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(result.data?.message ?? ''),
        severity: 'error',
      });
    } catch (error) {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error instanceof Error ? error.message : ''),
        severity: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    email,
    isProcessing,
    hasError,
    errorText: t('tr_emailNotAssociated'),
    handleEmailChange,
    handleBack,
    handleResetPin,
  };
};

export default useForgotPin;
