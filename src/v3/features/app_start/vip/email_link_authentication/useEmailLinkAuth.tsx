import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { setAuthPersistence, userSignInCustomToken } from '@services/firebase/auth';
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
import { dbAppSettingsUpdateUserInfoAfterLogin } from '@services/dexie/settings';

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

  const completeEmailAuth = async () => {
    try {
      if (isProcessing) return;

      hideMessage();

      setIsProcessing(true);

      await setAuthPersistence();

      const user = await userSignInCustomToken(code);

      const { status, data } = await apiUpdatePasswordlessInfo(user.uid);
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
        }

        if (cong_name.length > 0 && cong_role.length === 0) {
          result.unauthorized = true;
        }

        if (cong_name.length > 0 && cong_role.length > 0) {
          const approvedRole = cong_role.some((role) => APP_ROLES.includes(role));

          if (!approvedRole) {
            result.unauthorized = true;
          }

          if (approvedRole) {
            await dbAppSettingsUpdateUserInfoAfterLogin(data);

            // refetch auth after email update
            await userSignInCustomToken(code);

            result.encryption = true;
          }
        }
      } else {
        result.isVerifyMFA = true;
      }

      if (result.encryption) {
        setSearchParams('');
        setIsEmailLinkAuthenticate(false);
        setIsEncryptionCodeOpen(true);
      }

      if (result.isVerifyMFA) {
        setSearchParams('');
        setIsEmailLinkAuthenticate(false);
        setIsEmailAuth(false);
        setCurrentMFAStage('verify');
      }

      if (result.unauthorized) {
        setSearchParams('');
        setIsEmailLinkAuthenticate(false);
        setIsEmailAuth(false);
        setIsUnauthorizedRole(true);
      }

      if (result.createCongregation) {
        setSearchParams('');
        setIsEmailLinkAuthenticate(false);
        setIsEmailAuth(false);
        setIsCongAccountCreate(true);
      }

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

  return { completeEmailAuth, isProcessing, handleReturn, title, message, variant, hideMessage };
};

export default useEmailLinkAuth;
