import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { apiHostState, isAppLoadState, isOnlineState, visitorIDState } from '@states/app';
import { apiValidateMe } from '@services/api/user';
import { userSignOut } from '@services/firebase/auth';
import { handleDeleteDatabase } from '@services/app';
import { APP_ROLES, isDemo } from '@constants/index';
import { setRootModalOpen } from '@services/recoil/app';
import { accountTypeState } from '@states/settings';
import { apiFetchCongregationLastBackup } from '@services/api/congregation';
import { dbAppSettingsUpdateUserInfoAfterLogin } from '@services/dexie/settings';
import useFirebaseAuth from '@hooks/useFirebaseAuth';
import logger from '@services/logger/index';
import worker from '@services/worker/backupWorker';

const useUserAutoLogin = () => {
  const { isAuthenticated } = useFirebaseAuth();

  const isOnline = useRecoilValue(isOnlineState);
  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);
  const isAppLoad = useRecoilValue(isAppLoadState);
  const accountType = useRecoilValue(accountTypeState);

  const runFetch =
    !isDemo && apiHost !== '' && visitorID !== '' && accountType === 'vip' && !isAppLoad && isOnline && isAuthenticated;

  const { isPending, data, error } = useQuery({
    queryKey: ['whoami'],
    queryFn: apiValidateMe,
    enabled: runFetch,
  });

  const [autoLoginStatus, setAutoLoginStatus] = useState('');

  useEffect(() => {
    const handleLoginData = async () => {
      if (isPending) {
        setAutoLoginStatus('auto login process started');
        return;
      }

      if (data.status === 403) {
        await userSignOut();
        return;
      }

      // congregation not found -> user not authorized and delete local data
      if (data.status === 404) {
        await handleDeleteDatabase();
        return;
      }

      if (error || data.result.message) {
        const msg = error?.message || data.result.message;
        logger.error('app', msg);

        return;
      }

      if (data.status === 200) {
        const approvedRole = data.result.cong_role.some((role) => APP_ROLES.includes(role));

        if (!approvedRole) {
          await handleDeleteDatabase();
          return;
        }

        if (approvedRole) {
          await dbAppSettingsUpdateUserInfoAfterLogin(data);

          await setRootModalOpen(true);
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

        setAutoLoginStatus('auto login process completed');
      }
    };

    handleLoginData();
  }, [isPending, data, error]);

  return { autoLoginStatus };
};

export default useUserAutoLogin;
