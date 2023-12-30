import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { isOnlineState, visitorIDState } from '@states/app';
import {
  setCongAccountConnected,
  setIsAppLoad,
  setIsSetup,
  setIsUnauthorizedRole,
  setRootModalOpen,
} from '@services/recoil/app';
import { handleDeleteDatabase, loadApp, runUpdater } from '@services/cpe';
import { apiPocketValidate } from '@services/api/user';
import { POCKET_ROLES } from '@constants/index';
import { handleUpdateSetting, handleUpdateSettingFromRemote } from '@services/dexie/settings';
import { apiFetchSchedule } from '@services/api/schedule';
import { handleUpdateScheduleFromRemote } from '@services/cpe/schedules';
import { userLocalUIDState } from '@states/settings';

const useStartup = () => {
  const isOnline = useRecoilValue(isOnlineState);
  const visitorID = useRecoilValue(visitorIDState);
  const userLocalUID = useRecoilValue(userLocalUIDState);

  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const checkLoginState = async () => {
      if (userLocalUID.length === 0) {
        setIsSignUp(true);
        return;
      }

      if (!isOnline) {
        await setIsSetup(false);
        await loadApp();
        await runUpdater();
        setTimeout(async () => {
          await setIsAppLoad(false);
        }, 1000);
        return;
      }

      if (isOnline && visitorID.length > 0) {
        const { data, status } = await apiPocketValidate();

        if (status !== 200) {
          await handleDeleteDatabase();
          return;
        }

        const approvedRole = data.cong_role.some((role) => POCKET_ROLES.includes(role));

        if (!approvedRole) {
          await handleUpdateSetting({ account_type: '' });
          await setIsUnauthorizedRole(true);
          return;
        }

        await loadApp();
        await runUpdater();
        await handleUpdateSettingFromRemote(data);

        await setRootModalOpen(true);
        const { status: scheduleStatus, data: scheduleData } = await apiFetchSchedule();
        if (scheduleStatus === 200) {
          await handleUpdateScheduleFromRemote(scheduleData);
        }
        await setRootModalOpen(false);

        setIsSetup(false);
        setTimeout(async () => {
          setCongAccountConnected(true);
          setIsAppLoad(false);
        }, 1000);
      }
    };

    checkLoginState();
  }, [isOnline, visitorID, userLocalUID]);

  return { isSignUp };
};

export default useStartup;
