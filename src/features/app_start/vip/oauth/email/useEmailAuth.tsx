import { useContext, useEffect, useState } from 'react';
import {
  displayOnboardingFeedback,
  setIsEmailAuth,
  setIsUserSignIn,
} from '@services/recoil/app';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';
import { useAppTranslation } from '@hooks/index';
import { isEmailValid } from '@services/validator/index';
import { apiRequestPasswordlesssLink } from '@services/api/user';
import { getMessageByCode } from '@services/i18n/translation';
import { IconError } from '@components/icons';
import { infoMessageContext } from '../../signin/context';

const useEmailAuth = () => {
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

    if (!isEmailValid(userTmpEmail)) {
      await displayOnboardingFeedback({
        title: t('error_app_generic-title'),
        message: t('tr_emailNotSupported'),
      });
      showMessage();

      setIsProcessing(false);
      return;
    }

    const { status, data } = await apiRequestPasswordlesssLink(userTmpEmail);

    if (status !== 200) {
      await displayOnboardingFeedback({
        title: t('error_app_generic-title'),
        message: getMessageByCode(data.message),
      });
      showMessage();

      setIsProcessing(false);

      return;
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

  const { setInfoMessageData } = useContext(infoMessageContext);

  useEffect(() => {
    setInfoMessageData({
      variant: variant,
      messageIcon: <IconError />,
      messageHeader: title,
      message: message,
      onClose: hideMessage,
    });
  }, [setInfoMessageData, hideMessage, message, title, variant]);

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
