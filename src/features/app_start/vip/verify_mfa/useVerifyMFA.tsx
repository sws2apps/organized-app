import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { displayOnboardingFeedback } from '@services/states/app';
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
import { settingSchema } from '@services/dexie/schema';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';

const useVerifyMFA = () => {
  const { t } = useAppTranslation();

  const { hideMessage, message, showMessage, title, variant } = useFeedback();

  const setIsUserSignIn = useSetAtom(isUserSignInState);
  const setIsMfaVerify = useSetAtom(isUserMfaVerifyState);
  const setUnauthorized = useSetAtom(isUnauthorizedRoleState);
  const setIsEncryptionCodeOpen = useSetAtom(isEncryptionCodeOpenState);
  const setIsUserAccountCreated = useSetAtom(isUserAccountCreatedState);

  const tokenDev = useAtomValue(tokenDevState);
  const settings = useAtomValue(settingsState);

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

      if (midweekLocal) {
        midweekLocal.time = midweekRemote.time;
        midweekLocal.weekday = midweekRemote.weekday;
      } else {
        midweekMeeting.push({
          ...settingSchema.cong_settings.midweek_meeting.at(0),
          time: midweekRemote.time,
          type: midweekRemote.type,
          weekday: midweekRemote.weekday,
        });
      }
    }

    const weekendMeeting = structuredClone(
      settings.cong_settings.weekend_meeting
    );

    for (const weekendRemote of app_settings.cong_settings.weekend_meeting) {
      const weekendLocal = weekendMeeting.find(
        (record) => record.type === weekendRemote.type
      );

      if (weekendLocal) {
        weekendLocal.time = weekendRemote.time;
        weekendLocal.weekday = weekendRemote.weekday;
      } else {
        weekendMeeting.push({
          ...settingSchema.cong_settings.weekend_meeting.at(0),
          time: weekendRemote.time,
          type: weekendRemote.type,
          weekday: weekendRemote.weekday,
        });
      }
    }

    await dbAppSettingsUpdate({
      'cong_settings.country_code': app_settings.cong_settings.country_code,
      'cong_settings.cong_name': app_settings.cong_settings.cong_name,
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

        displayOnboardingFeedback({
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

      displayOnboardingFeedback({
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
