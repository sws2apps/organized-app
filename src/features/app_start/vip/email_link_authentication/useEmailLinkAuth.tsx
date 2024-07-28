import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  setAuthPersistence,
  userSignInCustomToken,
} from '@services/firebase/auth';
import { apiUpdatePasswordlessInfo } from '@services/api/user';
import {
  displayOnboardingFeedback,
  setCurrentMFAStage,
  setIsCongAccountCreate,
  setIsEmailAuth,
  setIsEmailLinkAuthenticate,
  setIsEncryptionCodeOpen,
  setIsUnauthorizedRole,
  setIsUserSignIn,
} from '@services/recoil/app';
import { APP_ROLES } from '@constants/index';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';
import { useAppTranslation } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { NextStepType } from './index.types';
import { UserLoginResponseType } from '@definition/api';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useEmailLinkAuth = () => {
  const { t } = useAppTranslation();

  const { hideMessage, message, showMessage, title, variant } = useFeedback();

  const [searchParams, setSearchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);

  const code = searchParams.get('code');

  const handleReturn = async () => {
    await setIsUserSignIn(false);
    await setIsEmailLinkAuthenticate(false);
    await setIsEmailAuth(true);
    setSearchParams('');
  };

  const handleResult = async (
    data: UserLoginResponseType,
    result: NextStepType
  ) => {
    setSearchParams('');
    setIsEmailLinkAuthenticate(false);
    setIsEmailAuth(false);

    await dbAppSettingsUpdate({
      'user_settings.account_type': 'vip',
      'user_settings.cong_role': data.cong_role,
      'user_settings.lastname': data.lastname,
      'user_settings.firstname': data.firstname,
    });

    if (result.encryption) {
      setIsEncryptionCodeOpen(true);
    } else if (result.isVerifyMFA) {
      setCurrentMFAStage('verify');
    } else if (result.unauthorized) {
      setIsUnauthorizedRole(true);
    } else if (result.createCongregation) {
      setIsCongAccountCreate(true);
    }
  };

  const completeEmailAuth = async () => {
    try {
      if (isProcessing) return;

      hideMessage();
      setIsProcessing(true);

      await setAuthPersistence();
      await userSignInCustomToken(code);

      const { status, data } = await apiUpdatePasswordlessInfo();
      localStorage.removeItem('emailForSignIn');

      if (status !== 200) {
        await displayOnboardingFeedback({
          title: t('tr_errorGeneric'),
          message: getMessageByCode(data.message),
        });
        showMessage();
        setIsProcessing(false);
        return;
      }

      const result: NextStepType = {};
      const { cong_name, cong_role, mfa } = data;

      if (mfa === 'not_enabled') {
        if (cong_name.length === 0) {
          result.createCongregation = true;
        } else if (cong_role.length === 0) {
          result.unauthorized = true;
        } else if (cong_role.some((role) => APP_ROLES.includes(role))) {
          await userSignInCustomToken(code);
          result.encryption = true;
        } else {
          result.unauthorized = true;
        }
      } else {
        result.isVerifyMFA = true;
      }

      await handleResult(data, result);
      setIsProcessing(false);
    } catch (err) {
      await displayOnboardingFeedback({
        title: t('tr_errorGeneric'),
        message: getMessageByCode(err.message),
      });
      showMessage();

      setIsProcessing(false);
    }
  };

  useEffect(() => {
    setIsEmailAuth(false);
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
