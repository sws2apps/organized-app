import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { userEmailState } from '@states/app';
import { appLockViewState } from '@states/app_lock';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { apiRequestPasswordlesssLink } from '@services/api/user';

const useForgotPin = () => {
  const { t } = useAppTranslation();
  const savedEmail = useAtomValue(userEmailState);
  const setView = useSetAtom(appLockViewState);

  const [email, setEmail] = useState(savedEmail || '');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEmailChange = (value: string) => setEmail(value);

  const handleBack = () => setView('unlock');

  const handleResetPin = async () => {
    if (isProcessing) return;
    if (!email || email.trim().length === 0) return;

    setIsProcessing(true);
    try {
      const result = await apiRequestPasswordlesssLink(email.trim());

      if (result.status === 200) {
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
        message: getMessageByCode(
          error instanceof Error ? error.message : ''
        ),
        severity: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    email,
    isProcessing,
    handleEmailChange,
    handleBack,
    handleResetPin,
  };
};

export default useForgotPin;
