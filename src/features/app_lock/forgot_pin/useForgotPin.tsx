import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { useAppTranslation, useFirebaseAuth } from '@hooks/index';
import { appLockViewState } from '@states/app_lock';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { apiRequestPasswordlesssLink } from '@services/api/user';
import { appLockMarkPinResetRequested } from '@services/app_lock/reset';

const normalize = (email: string) => email.trim().toLowerCase();

const useForgotPin = () => {
  const { t } = useAppTranslation();
  const { user } = useFirebaseAuth();

  const setView = useSetAtom(appLockViewState);

  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleEmailChange = (value: string) => {
    setErrorText('');
    setEmail(value);
  };

  const handleBack = () => setView('unlock');

  const handleResetPin = async () => {
    if (isProcessing || email.trim().length === 0) return;

    // without a loaded account there is nothing to check the email against
    if (!user?.email) {
      setErrorText(t('tr_PINForgotUnavailable'));
      return;
    }

    // the link signs this device in again, so it may only go to its own account
    if (normalize(email) !== normalize(user.email)) {
      setErrorText(t('tr_appLockEmailMismatch'));
      return;
    }

    setIsProcessing(true);

    try {
      const result = await apiRequestPasswordlesssLink(user.email);

      if (result.status !== 200) {
        throw new Error(result.data?.message);
      }

      // the link may open in another tab or after a restart
      appLockMarkPinResetRequested(user.email);

      displaySnackNotification({
        header: t('tr_PINReset'),
        message: t('tr_PINForgotEmailSent'),
        severity: 'success',
      });

      setView('unlock');
    } catch (error) {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode((error as Error).message),
        severity: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    email,
    isProcessing,
    errorText,
    handleEmailChange,
    handleBack,
    handleResetPin,
  };
};

export default useForgotPin;
