import { useMemo, useState } from 'react';
import { useSetAtom } from 'jotai';
import { displayOnboardingFeedback } from '@services/states/app';
import { useAppTranslation } from '@hooks/index';
import { isEmailValid } from '@services/validator/index';
import { apiRequestPasswordlesssLink } from '@services/api/user';
import {
  devAuthLinkState,
  devAuthOTPState,
  isEmailSentState,
  isUserSignInState,
} from '@states/app';
import { getMessageByCode } from '@services/i18n/translation';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';

const useOAuthEmail = () => {
  const { t } = useAppTranslation();

  const { hideMessage, showMessage } = useFeedback();

  const setDevLink = useSetAtom(devAuthLinkState);
  const setDevOTP = useSetAtom(devAuthOTPState);
  const setIsUserSignIn = useSetAtom(isUserSignInState);
  const setIsEmailSent = useSetAtom(isEmailSentState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [userTmpEmail, setUserTmpEmail] = useState('');

  const oauth = useMemo(() => {
    if (userTmpEmail.includes('@gmail')) {
      return 'Google';
    }

    if (userTmpEmail.includes('@yahoo')) {
      return 'Yahoo';
    }
  }, [userTmpEmail]);

  const handleSendLink = async () => {
    if (isProcessing) return;

    setDevLink('');
    setDevOTP('');
    hideMessage();

    setIsProcessing(true);

    if (!isEmailValid(userTmpEmail)) {
      displayOnboardingFeedback({
        title: t('error_app_generic-title'),
        message: t('tr_emailNotSupported'),
      });
      showMessage();

      setIsProcessing(false);
      return;
    }

    const { status, data } = await apiRequestPasswordlesssLink(userTmpEmail);

    if (status !== 200) {
      displayOnboardingFeedback({
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

    if (data.otp) {
      setDevOTP(data.otp);
    }

    setIsProcessing(false);
    setIsUserSignIn(false);
    setIsEmailSent(true);
  };

  return {
    isProcessing,
    setUserTmpEmail,
    handleSendLink,
    userTmpEmail,
    oauth,
  };
};

export default useOAuthEmail;
