import { useEffect, useRef, useState } from 'react';
import { displayOnboardingFeedback, setIsEmailAuth, setIsUserSignIn } from '@services/recoil/app';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';
import { useAppTranslation } from '@hooks/index';
import { isEmailValid } from '@services/validator/index';
import { apiRequestPasswordlesssLink } from '@services/api/user';
import { getMessageByCode } from '@services/i18n/translation';

const useEmailAuth = () => {
  const cancel = useRef<boolean>();

  const { t } = useAppTranslation();

  const { hideMessage, message, showMessage, title, variant } = useFeedback();

  const [isProcessing, setIsProcessing] = useState(false);
  const [userTmpEmail, setUserTmpEmail] = useState('');
  const [devLink, setDevLink] = useState('');

  const handleProviderSignIn = () => {
    setIsUserSignIn(true);
    setIsEmailAuth(false);
  };

  const handleSendLink = async () => {
    if (isProcessing) return;

    setDevLink('');
    hideMessage();

    setIsProcessing(true);

    cancel.current = false;

    if (!isEmailValid(userTmpEmail)) {
      await displayOnboardingFeedback({
        title: t('tr_errorGeneric'),
        message: t('tr_emailNotSupported'),
      });
      showMessage();

      setIsProcessing(false);
      return;
    }

    const { status, data } = await apiRequestPasswordlesssLink(userTmpEmail);

    if (status !== 200) {
      await displayOnboardingFeedback({
        title: t('tr_errorGeneric'),
        message: getMessageByCode(data.message),
      });
      showMessage();

      setIsProcessing(false);
    }

    localStorage.setItem('emailForSignIn', userTmpEmail);

    if (data.link) {
      setDevLink(data.link);
    }

    await displayOnboardingFeedback({
      title: t('tr_emailAuthSentHeader'),
      message: t('tr_emailAuthSent'),
      variant: 'success',
    });
    showMessage();

    setIsProcessing(false);
  };

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

  return {
    isProcessing,
    setUserTmpEmail,
    handleProviderSignIn,
    handleSendLink,
    userTmpEmail,
    title,
    message,
    hideMessage,
    variant,
    devLink,
  };
};

export default useEmailAuth;
