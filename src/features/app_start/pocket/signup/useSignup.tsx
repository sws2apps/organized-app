import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  congAccountConnectedState,
  isAppLoadState,
  isOnlineState,
  isSetupState,
  offlineOverrideState,
} from '@states/app';
import {
  displayOnboardingFeedback,
  setIsAccountChoose,
} from '@services/states/app';
import { UserLoginResponseType } from '@definition/api';
import { getMessageByCode } from '@services/i18n/translation';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { apiPocketSignup } from '@services/api/pocket';
import { settingsState } from '@states/settings';
import { loadApp, runUpdater } from '@services/app';
import { settingSchema } from '@services/dexie/schema';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';

const useSignup = () => {
  const setIsSetup = useSetAtom(isSetupState);
  const setOfflineOverride = useSetAtom(offlineOverrideState);
  const setCongAccountConnected = useSetAtom(congAccountConnectedState);
  const setIsAppLoad = useSetAtom(isAppLoadState);

  const isOnline = useAtomValue(isOnlineState);
  const settings = useAtomValue(settingsState);

  const { hideMessage, message, showMessage, title, variant } = useFeedback();

  const [code, setCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCodeChange = (value: string) => setCode(value);

  const handleReturnChooser = async () => {
    await dbAppSettingsUpdate({ 'user_settings.account_type': '' });
    setIsAccountChoose(true);
  };

  const handleLoadApp = async () => {
    await runUpdater();

    loadApp();

    setIsSetup(false);

    setTimeout(async () => {
      setOfflineOverride(false);
      setCongAccountConnected(true);
      setIsAppLoad(false);
    }, 2000);
  };

  const handleUpdateSettings = async (
    data: UserLoginResponseType,
    accessCode: string
  ) => {
    const { app_settings } = data;

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
      'user_settings.account_type': 'pocket',
      'user_settings.lastname': app_settings.user_settings.lastname,
      'user_settings.firstname': app_settings.user_settings.firstname,
      'user_settings.user_local_uid': app_settings.user_settings.user_local_uid,
      'user_settings.user_members_delegate':
        app_settings.user_settings.user_members_delegate,
      'cong_settings.cong_access_code': accessCode,
      'cong_settings.country_code': app_settings.cong_settings.country_code,
      'cong_settings.cong_name': app_settings.cong_settings.cong_name,
      'user_settings.cong_role': app_settings.user_settings.cong_role,
      'cong_settings.cong_location': app_settings.cong_settings.cong_location,
      'cong_settings.cong_circuit': app_settings.cong_settings.cong_circuit,
      'cong_settings.midweek_meeting': midweekMeeting,
      'cong_settings.weekend_meeting': weekendMeeting,
      'cong_settings.cong_new': false,
    });

    await handleLoadApp();
  };

  const handleSignup = async (accessCode: string) => {
    const { status, data } = await apiPocketSignup(code);

    if (status !== 200) {
      throw new Error(data?.message);
    }

    await handleUpdateSettings(data, accessCode);
  };

  const handleValidate = async () => {
    if (isProcessing) return;

    try {
      hideMessage();

      setIsProcessing(true);

      const pattern = '(.+?)-(.+?)-(.+?)$';
      let rgExp = new RegExp(pattern, 'g');
      const isCodeValid = rgExp.test(code);

      if (code.length < 10 || !isCodeValid) {
        displayOnboardingFeedback({
          title: getMessageByCode(
            'error_app_security_invalid-invitation-code-title'
          ),
          message: getMessageByCode(
            'error_app_security_invalid-invitation-code'
          ),
        });
        showMessage();
        setIsProcessing(false);
        return;
      }

      rgExp = new RegExp(pattern, 'g');
      const groups = rgExp.exec(code);
      const matches = Array.from(groups);
      const accessCode = matches.at(3)!;

      await handleSignup(accessCode);

      setIsProcessing(false);
    } catch (err) {
      console.error(err);

      setIsProcessing(false);

      displayOnboardingFeedback({
        title: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(err.message),
      });

      showMessage();
    }
  };

  return {
    isOnline,
    handleReturnChooser,
    isProcessing,
    handleCodeChange,
    handleValidate,
    code,
    hideMessage,
    title,
    message,
    variant,
  };
};

export default useSignup;
