import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { isOnlineState, visitorIDState } from '@states/app';
import { setCongAccountConnected, setIsAppLoad, setIsSetup, setIsUnauthorizedRole } from '@services/recoil/app';
import { handleDeleteDatabase, loadApp, runUpdater } from '@services/app';
import { apiPocketValidate } from '@services/api/user';
import { POCKET_ROLES } from '@constants/index';
import { dbAppSettingsUpdate, dbAppSettingsUpdateFromRemote } from '@services/dexie/settings';
import { userLocalUIDState } from '@states/settings';

const useStartup = () => {
  const timeoutId = useRef<NodeJS.Timeout>();

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
        timeoutId.current = setTimeout(async () => {
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
          await dbAppSettingsUpdate({ account_type: '' });
          await setIsUnauthorizedRole(true);
          return;
        }

        await loadApp();
        await runUpdater();
        await dbAppSettingsUpdateFromRemote(data);

        setIsSetup(false);
        timeoutId.current = setTimeout(async () => {
          setCongAccountConnected(true);
          setIsAppLoad(false);
        }, 1000);
      }
    };

    checkLoginState();

    return () => {
      clearTimeout(timeoutId.current);
    };
  }, [isOnline, visitorID, userLocalUID]);

  return { isSignUp };
};

export default useStartup;
