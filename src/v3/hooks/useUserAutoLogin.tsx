import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { apiHostState, isAppLoadState, isOnlineState } from '@states/app';
import { apiValidateMe } from '@services/api/user';
import { userSignOut } from '@services/firebase/auth';
import { handleDeleteDatabase } from '@services/app';
import { APP_ROLES, isDemo } from '@constants/index';
import { accountTypeState, congNumberState } from '@states/settings';
import { dbAppSettingsUpdateUserInfoAfterLogin } from '@services/dexie/settings';
import useFirebaseAuth from '@hooks/useFirebaseAuth';
import logger from '@services/logger/index';
import worker from '@services/worker/backupWorker';

const useUserAutoLogin = () => {
  const { isAuthenticated } = useFirebaseAuth();

  const isOnline = useRecoilValue(isOnlineState);
  const apiHost = useRecoilValue(apiHostState);
  const isAppLoad = useRecoilValue(isAppLoadState);
  const accountType = useRecoilValue(accountTypeState);
  const congNumber = useRecoilValue(congNumberState);

  const runFetch =
    !isDemo &&
    apiHost !== '' &&
    accountType === 'vip' &&
    !isAppLoad &&
    isOnline &&
    isAuthenticated;

  const { isPending, data, error } = useQuery({
    queryKey: ['whoami'],
    queryFn: apiValidateMe,
    enabled: runFetch,
  });

  const [autoLoginStatus, setAutoLoginStatus] = useState('');

  useEffect(() => {
    const handleLoginData = async () => {
      try {
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
          if (congNumber.length > 0 && data.result.cong_number !== congNumber) {
            await handleDeleteDatabase();
            return;
          }

          const approvedRole = data.result.cong_role.some((role) =>
            APP_ROLES.includes(role)
          );

          if (!approvedRole) {
            await handleDeleteDatabase();
            return;
          }

          if (approvedRole) {
            await dbAppSettingsUpdateUserInfoAfterLogin(data);
            worker.postMessage('startWorker');
          }

          setAutoLoginStatus('auto login process completed');
        }
      } catch (error) {
        console.error(error);
      }
    };

    handleLoginData();
  }, [isPending, data, error, congNumber]);

  return { autoLoginStatus };
};

export default useUserAutoLogin;
