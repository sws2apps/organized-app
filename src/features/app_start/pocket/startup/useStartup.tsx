import { useEffect, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { settingsState, userLocalUIDState } from '@states/settings';
import { handleDeleteDatabase, loadApp, runUpdater } from '@services/app';
import {
  congAccountConnectedState,
  isAppLoadState,
  isSetupState,
  offlineOverrideState,
} from '@states/app';
import { apiPocketValidateMe } from '@services/api/pocket';
import { UserLoginResponseType } from '@definition/api';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { settingSchema } from '@services/dexie/schema';
import useInternetChecker from '@hooks/useInternetChecker';

const useStartup = () => {
  const { isNavigatorOnline } = useInternetChecker();

  const setIsSetup = useSetAtom(isSetupState);
  const setOfflineOverride = useSetAtom(offlineOverrideState);
  const setCongAccountConnected = useSetAtom(congAccountConnectedState);
  const setIsAppLoad = useSetAtom(isAppLoadState);

  const userLocalUID = useAtomValue(userLocalUIDState);
  const settings = useAtomValue(settingsState);

  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const handleLoadApp = async () => {
      loadApp();

      setIsSetup(false);

      await runUpdater();

      setTimeout(async () => {
        setOfflineOverride(false);
        setIsAppLoad(false);
      }, 2000);
    };

    const handleUpdateSettings = async (data: UserLoginResponseType) => {
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
        'user_settings.user_local_uid':
          app_settings.user_settings.user_local_uid,
        'user_settings.user_members_delegate':
          app_settings.user_settings.user_members_delegate,
        'cong_settings.country_code': app_settings.cong_settings.country_code,
        'cong_settings.cong_name': app_settings.cong_settings.cong_name,
        'cong_settings.cong_number': app_settings.cong_settings.cong_number,
        'user_settings.cong_role': app_settings.user_settings.cong_role,
        'cong_settings.cong_location': app_settings.cong_settings.cong_location,
        'cong_settings.cong_circuit': app_settings.cong_settings.cong_circuit,
        'cong_settings.midweek_meeting': midweekMeeting,
        'cong_settings.weekend_meeting': weekendMeeting,
      });

      setCongAccountConnected(true);

      await handleLoadApp();
    };

    const handleValidate = async () => {
      const { result, status } = await apiPocketValidateMe();

      if (status === 403 || status === 404) {
        await handleDeleteDatabase();
        return;
      }

      if (status !== 200) {
        throw new Error(result?.message);
      }

      await handleUpdateSettings(result);
    };

    const checkLoginState = async () => {
      try {
        if (userLocalUID.length === 0) {
          setIsSignUp(true);
          return;
        }

        if (isNavigatorOnline) {
          await handleValidate();
          return;
        }

        if (!isNavigatorOnline) {
          await handleLoadApp();
        }
      } catch (error) {
        console.error(error);

        throw new Error(error?.message);
      }
    };

    checkLoginState();
  }, [
    userLocalUID,
    isNavigatorOnline,
    setCongAccountConnected,
    setIsAppLoad,
    setIsSetup,
    setOfflineOverride,
    settings,
  ]);

  return { isSignUp };
};

export default useStartup;
