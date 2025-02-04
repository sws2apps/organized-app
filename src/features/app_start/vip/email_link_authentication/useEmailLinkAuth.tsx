import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  setAuthPersistence,
  userSignInCustomToken,
} from '@services/firebase/auth';
import { apiUpdatePasswordlessInfo } from '@services/api/user';
import {
  displayOnboardingFeedback,
  setIsCongAccountCreate,
  setIsEmailLinkAuthenticate,
  setIsEncryptionCodeOpen,
  setIsUnauthorizedRole,
  setIsUserSignIn,
} from '@services/recoil/app';
import { APP_ROLES } from '@constants/index';
import { useAppTranslation } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { NextStepType } from './index.types';
import { UserLoginResponseType } from '@definition/api';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { settingsState } from '@states/settings';
import {
  isUserAccountCreatedState,
  isUserMfaVerifyState,
  isUserSignInState,
  tokenDevState,
} from '@states/app';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';

const useEmailLinkAuth = () => {
  const { t } = useAppTranslation();

  const { hideMessage, message, showMessage, title, variant } = useFeedback();

  const [searchParams, setSearchParams] = useSearchParams();

  const setVerifyMFA = useSetRecoilState(isUserMfaVerifyState);
  const setTokenDev = useSetRecoilState(tokenDevState);
  const setSignin = useSetRecoilState(isUserSignInState);
  const setIsUserAccountCreated = useSetRecoilState(isUserAccountCreatedState);

  const settings = useRecoilValue(settingsState);

  const [isProcessing, setIsProcessing] = useState(false);

  const code = searchParams.get('code');

  const handleReturn = async () => {
    await setIsEmailLinkAuthenticate(false);
    await setIsUserSignIn(true);
    setSearchParams('');
  };

  const handleResult = async (
    data: UserLoginResponseType,
    result: NextStepType
  ) => {
    setSearchParams('');
    setIsEmailLinkAuthenticate(false);
    setIsUserSignIn(false);

    if (data.app_settings) {
      await dbAppSettingsUpdate({
        'user_settings.account_type': 'vip',
        'user_settings.lastname': data.app_settings.user_settings.lastname,
        'user_settings.firstname': data.app_settings.user_settings.firstname,
      });
    }

    if (result.encryption) {
      const { app_settings } = data;

      const midweekMeeting = structuredClone(
        settings.cong_settings.midweek_meeting
      );

      for (const midweekRemote of app_settings.cong_settings.midweek_meeting) {
        const midweekLocal = midweekMeeting.find(
          (record) => record.type === midweekRemote.type
        );

        midweekLocal.time = midweekRemote.time;
        midweekLocal.weekday = midweekRemote.weekday;
      }

      const weekendMeeting = structuredClone(
        settings.cong_settings.weekend_meeting
      );

      for (const weekendRemote of app_settings.cong_settings.weekend_meeting) {
        const weekendLocal = weekendMeeting.find(
          (record) => record.type === weekendRemote.type
        );

        weekendLocal.time = weekendRemote.time;
        weekendLocal.weekday = weekendRemote.weekday;
      }

      await dbAppSettingsUpdate({
        'cong_settings.country_code': app_settings.cong_settings.country_code,
        'cong_settings.cong_name': app_settings.cong_settings.cong_name,
        'cong_settings.cong_number': app_settings.cong_settings.cong_number,
        'user_settings.cong_role': app_settings.user_settings.cong_role,
        'cong_settings.cong_location': app_settings.cong_settings.cong_location,
        'cong_settings.cong_circuit': app_settings.cong_settings.cong_circuit,
        'cong_settings.midweek_meeting': midweekMeeting,
        'cong_settings.weekend_meeting': weekendMeeting,
        'cong_settings.cong_new': false,
      });

      setSignin(false);
      setIsEncryptionCodeOpen(true);
    } else if (result.isVerifyMFA) {
      setVerifyMFA(true);
    } else if (result.unauthorized) {
      setIsUnauthorizedRole(true);
    } else if (result.createCongregation) {
      setSignin(false);
      setIsUserAccountCreated(true);
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
          title: t('error_app_generic-title'),
          message: getMessageByCode(data.message),
        });
        showMessage();
        setIsProcessing(false);
        return;
      }

      const result: NextStepType = {};

      const {
        app_settings,
        message,
        code: tokenDev,
      } = data as UserLoginResponseType;

      if (message === 'MFA_VERIFY') {
        setTokenDev(tokenDev);
        result.isVerifyMFA = true;
      }

      if (app_settings?.user_settings.mfa === 'not_enabled') {
        if (!app_settings.cong_settings) {
          result.createCongregation = true;
        } else if (app_settings.user_settings.cong_role.length === 0) {
          result.unauthorized = true;
        } else if (
          app_settings.user_settings.cong_role.some((role) =>
            APP_ROLES.includes(role)
          )
        ) {
          await userSignInCustomToken(code);
          result.encryption = true;
        } else {
          result.unauthorized = true;
        }
      }

      await handleResult(data, result);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);

      await displayOnboardingFeedback({
        title: t('error_app_generic-title'),
        message: getMessageByCode(err.message),
      });
      showMessage();

      setIsProcessing(false);
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
