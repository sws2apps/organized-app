import { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { displayOnboardingFeedback } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { apiHandleVerifyOTP } from '@services/api/user';
import {
  isEncryptionCodeOpenState,
  isUnauthorizedRoleState,
  isUserAccountCreatedState,
  isUserMfaVerifyState,
  isUserSignInState,
  tokenDevState,
} from '@states/app';
import { UserLoginResponseType } from '@definition/api';
import { APP_ROLES } from '@constants/index';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { settingsState } from '@states/settings';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';

const useVerifyMFA = () => {
  const { t } = useAppTranslation();

  const { hideMessage, message, showMessage, title, variant } = useFeedback();

  const setIsUserSignIn = useSetRecoilState(isUserSignInState);
  const setIsMfaVerify = useSetRecoilState(isUserMfaVerifyState);
  const setUnauthorized = useSetRecoilState(isUnauthorizedRoleState);
  const setIsEncryptionCodeOpen = useSetRecoilState(isEncryptionCodeOpenState);
  const setIsUserAccountCreated = useSetRecoilState(isUserAccountCreatedState);

  const tokenDev = useRecoilValue(tokenDevState);
  const settings = useRecoilValue(settingsState);

  const [code, setCode] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleGoBack = () => {
    setIsMfaVerify(false);
    setIsUserSignIn(true);
  };

  const handleCodeChange = (value: string) => {
    setHasError(false);
    setCode(value);

    if (value.length === 6) {
      handleVerifyCode(value);
    }
  };

  const handleAuthorization = async ({
    app_settings,
  }: UserLoginResponseType) => {
    if (app_settings) {
      await dbAppSettingsUpdate({
        'user_settings.account_type': 'vip',
        'user_settings.lastname': app_settings.user_settings.lastname,
        'user_settings.firstname': app_settings.user_settings.firstname,
      });
    }

    if (!app_settings.cong_settings) {
      setIsMfaVerify(false);
      setIsUserAccountCreated(true);

      return;
    }

    if (app_settings.user_settings.cong_role.length === 0) {
      setIsMfaVerify(false);
      setUnauthorized(true);

      return;
    }

    const roleApproved = app_settings.user_settings.cong_role.some((role) =>
      APP_ROLES.includes(role)
    );

    if (!roleApproved) {
      setIsMfaVerify(false);
      setUnauthorized(true);

      return;
    }

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

    setIsMfaVerify(false);
    setIsEncryptionCodeOpen(true);
  };

  const handleVerifyCode = async (code: string) => {
    try {
      const { data, status } = await apiHandleVerifyOTP(code);

      if (status === 403) {
        setHasError(true);

        await displayOnboardingFeedback({
          title: t('tr_2FAIncorrect'),
          message: t('tr_2FAIncorrectDesc'),
        });

        showMessage();

        return;
      }

      if (status !== 200) {
        throw new Error(data?.message);
      }

      handleAuthorization(data);
    } catch (error) {
      console.error(error);

      await displayOnboardingFeedback({
        title: t('error_app_generic-title'),
        message: getMessageByCode(error.message),
      });

      showMessage();
    }
  };

  return {
    title,
    message,
    variant,
    hideMessage,
    handleCodeChange,
    code,
    hasError,
    handleGoBack,
    tokenDev,
  };
};

export default useVerifyMFA;
