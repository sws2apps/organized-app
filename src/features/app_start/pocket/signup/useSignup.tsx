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
import { withCongSettingsDefaults } from '@services/states/settings';
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

    await loadApp();

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

    if (!app_settings?.cong_settings) {
      throw new Error('error_app_generic-title');
    }
    // pocketStartup requires a non-empty local UID. A signup response
    // without one can never recover, so fail the signup instead of
    // persisting an empty sentinel.
    if (!app_settings.user_settings.user_local_uid) {
      throw new Error('error_app_generic-title');
    }

    const localCongSettings = withCongSettingsDefaults(settings?.cong_settings);

    const midweekMeeting = structuredClone(localCongSettings.midweek_meeting);

    for (const remote of app_settings.cong_settings.midweek_meeting ?? []) {
      const local = midweekMeeting.find(
        (record) => record.type === remote.type
      );

      if (local) {
        local.time = remote.time;
        local.weekday = remote.weekday;
      } else {
        const newMeeting = structuredClone(
          settingSchema.cong_settings.midweek_meeting[0]
        );
        newMeeting.type = remote.type;
        newMeeting.time = remote.time;
        newMeeting.weekday = remote.weekday;
        midweekMeeting.push(newMeeting);
      }
    }

    const weekendMeeting = structuredClone(localCongSettings.weekend_meeting);

    for (const remote of app_settings.cong_settings.weekend_meeting ?? []) {
      const local = weekendMeeting.find(
        (record) => record.type === remote.type
      );

      if (local) {
        local.time = remote.time;
        local.weekday = remote.weekday;
      } else {
        const newMeeting = structuredClone(
          settingSchema.cong_settings.weekend_meeting[0]
        );
        newMeeting.type = remote.type;
        newMeeting.time = remote.time;
        newMeeting.weekday = remote.weekday;
        weekendMeeting.push(newMeeting);
      }
    }

    await dbAppSettingsUpdate({
      'user_settings.account_type': 'pocket',
      'user_settings.lastname': app_settings.user_settings.lastname,
      'user_settings.firstname': app_settings.user_settings.firstname,
      'user_settings.user_local_uid': app_settings.user_settings.user_local_uid,
      'user_settings.user_members_delegate':
        app_settings.user_settings.user_members_delegate ?? [],
      'cong_settings.cong_access_code': accessCode,
      'cong_settings.country_code': app_settings.cong_settings.country_code,
      'cong_settings.cong_name': app_settings.cong_settings.cong_name,
      // The Pocket API only includes cong_number when one is configured.
      // Signup may run while a previous account's settings are still stored,
      // so reset to the schema default when the API omits the field instead
      // of keeping the old congregation's number.
      'cong_settings.cong_number':
        app_settings.cong_settings.cong_number ??
        structuredClone(settingSchema.cong_settings.cong_number),
      'user_settings.cong_role': app_settings.user_settings.cong_role ?? [],
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
      if (!groups) {
        throw new Error('error_app_security_invalid-invitation-code');
      }

      const accessCode = groups.at(3)!;

      await handleSignup(accessCode);

      setIsProcessing(false);
    } catch (err) {
      console.error(err);

      setIsProcessing(false);

      const message =
        err instanceof Error ? err.message : 'error_app_generic-title';
      displayOnboardingFeedback({
        title: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(message),
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
