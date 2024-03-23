import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import logger from '@services/logger/index';
import useFirebaseAuth from '@hooks/useFirebaseAuth';
import { apiHostState, isAppLoadState, isOnlineState, visitorIDState } from '@states/app';
import { apiValidateMe } from '@services/api/user';
import { userSignOut } from '@services/firebase/auth';
import { handleDeleteDatabase, updateUserInfoAfterLogin } from '@services/app';
import { APP_ROLES } from '@constants/index';
import { setCongAccountConnected, setRootModalOpen } from '@services/recoil/app';
import { apiFetchSchedule } from '@services/api/schedule';
import { handleUpdateScheduleFromRemote } from '@services/app/schedules';
import { accountTypeState } from '@states/settings';
import { apiFetchCongregationLastBackup } from '@services/api/congregation';
import worker from '@services/worker/backupWorker';

const useUserAutoLogin = () => {
  const { isAuthenticated } = useFirebaseAuth();

  const isOnline = useRecoilValue(isOnlineState);
  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);
  const isAppLoad = useRecoilValue(isAppLoadState);
  const accountType = useRecoilValue(accountTypeState);

  const [autoLoginStatus, setAutoLoginStatus] = useState('');

  const checkLogin = useCallback(async () => {
    try {
      setAutoLoginStatus('auto login process started');

      if (isOnline && isAuthenticated && apiHost !== '' && visitorID !== '') {
        const { status, data } = await apiValidateMe();

        if (status === 403) {
          await userSignOut();
          return;
        }

        // congregation not found -> user not authorized and delete local data
        if (status === 404) {
          await handleDeleteDatabase();
          return;
        }

        if (status === 200) {
          const approvedRole = data.cong_role.some((role) => APP_ROLES.includes(role));

          if (!approvedRole) {
            await handleDeleteDatabase();
            return;
          }

          if (approvedRole) {
            await updateUserInfoAfterLogin(data);

            await setRootModalOpen(true);
            const { status: scheduleStatus, data: scheduleData } = await apiFetchSchedule();
            if (scheduleStatus === 200) {
              await handleUpdateScheduleFromRemote(scheduleData);
            }

            const { status, data: backup } = await apiFetchCongregationLastBackup();
            if (status === 200) {
              if (backup.cong_last_backup !== 'NO_BACKUP' || backup.user_last_backup !== 'NO_BACKUP') {
                const lastDate =
                  backup.cong_last_backup !== 'NO_BACKUP' ? backup.cong_last_backup : backup.user_last_backup;

                worker.postMessage({ field: 'lastBackup', value: lastDate });
              }
            }

            await setRootModalOpen(false);

            worker.postMessage('startWorker');
          }
        }
      }

      setAutoLoginStatus('auto login process completed');
    } catch (err) {
      logger.error('app', err.message);
    }
  }, [isAuthenticated, apiHost, visitorID, isOnline]);

  useEffect(() => {
    if (accountType === 'vip' && !isAppLoad && isOnline && isAuthenticated) {
      checkLogin();
    } else {
      setCongAccountConnected(false);
    }
  }, [accountType, isAppLoad, isAuthenticated, checkLogin, isOnline]);

  return { autoLoginStatus };
};

export default useUserAutoLogin;
