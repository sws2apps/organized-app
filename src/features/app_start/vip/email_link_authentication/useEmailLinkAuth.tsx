import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useSetAtom } from 'jotai';
import {
  setAuthPersistence,
  userSignInCustomToken,
} from '@services/firebase/auth';
import { apiUpdatePasswordlessInfo } from '@services/api/user';
import {
  displayOnboardingFeedback,
  setIsCongAccountCreate,
  setIsEmailLinkAuthenticate,
  setIsUnauthorizedRole,
  setIsUserSignIn,
} from '@services/states/app';
import { useAppTranslation } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { NextStepType } from './index.types';
import { UserLoginResponseType } from '@definition/api';
import {
  isEmailLinkAuthenticateState,
  isUserAccountCreatedState,
} from '@states/app';
import useAuth from '../hooks/useAuth';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';

const useEmailLinkAuth = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { t } = useAppTranslation();

  const { hideMessage, message, showMessage, title, variant } = useFeedback();

  const { determineNextStep, updateUserSettings } = useAuth();

  const setIsUserAccountCreated = useSetAtom(isUserAccountCreatedState);
  const setIsEmailAuth = useSetAtom(isEmailLinkAuthenticateState);

  const [isProcessing, setIsProcessing] = useState(false);

  const code = searchParams.get('code');

  const handleAuthorizationError = async (message: string) => {
    displayOnboardingFeedback({
      title: getMessageByCode('error_app_generic-title'),
      message: getMessageByCode(message),
    });

    showMessage();
    setIsProcessing(false);
  };

  const handleReturn = () => {
    setIsEmailLinkAuthenticate(false);
    setIsUserSignIn(true);
    setSearchParams('');
  };

  const handleUnauthorizedUser = () => {
    setIsEmailAuth(true);
    setIsUserAccountCreated(false);
    setIsUnauthorizedRole(true);
  };

  const completeEmailAuth = async () => {
    try {
      if (isProcessing) return;

      hideMessage();
      setIsProcessing(true);

      await setAuthPersistence();
      const result = await userSignInCustomToken(code);

      if (!result) return;

      const { status, data } = await apiUpdatePasswordlessInfo();

      setSearchParams('');

      if (status !== 200) {
        handleAuthorizationError(data.message);
        return;
      }

      const nextStep: NextStepType = determineNextStep(
        data as UserLoginResponseType
      );

      if (
        nextStep.isVerifyMFA ||
        nextStep.encryption ||
        nextStep.createCongregation
      ) {
        await updateUserSettings(data as UserLoginResponseType, nextStep);
      }

      if (nextStep.unauthorized) {
        handleUnauthorizedUser();
      }

      setIsProcessing(false);
    } catch (err) {
      console.error(err);

      await handleAuthorizationError(
        err.code || err.message || t('error_app_generic-desc')
      );
    }
  };

  useEffect(() => {
    setIsUserSignIn(false);
    setIsCongAccountCreate(false);
  }, []);

  return {
    completeEmailAuth,
    isProcessing,
    handleReturn,
    title,
    message,
    variant,
    hideMessage,
  };
};

export default useEmailLinkAuth;
