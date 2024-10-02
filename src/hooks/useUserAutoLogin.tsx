import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import {
  apiHostState,
  congAccountConnectedState,
  congIDState,
  isAppLoadState,
  isMFAEnabledState,
  isOnlineState,
  userIDState,
} from '@states/app';
import { apiValidateMe } from '@services/api/user';
import { userSignOut } from '@services/firebase/auth';
import { handleDeleteDatabase } from '@services/app';
import { APP_ROLES, isDemo } from '@constants/index';
import {
  accountTypeState,
  backupAutoState,
  congNumberState,
} from '@states/settings';
import useFirebaseAuth from '@hooks/useFirebaseAuth';
import logger from '@services/logger/index';
import worker from '@services/worker/backupWorker';

const useUserAutoLogin = () => {
  const { isAuthenticated } = useFirebaseAuth();

  const setCongID = useSetRecoilState(congIDState);
  const setCongConnected = useSetRecoilState(congAccountConnectedState);
  const setUserID = useSetRecoilState(userIDState);
  const setIsMFAEnabled = useSetRecoilState(isMFAEnabledState);

  const isOnline = useRecoilValue(isOnlineState);
  const apiHost = useRecoilValue(apiHostState);
  const isAppLoad = useRecoilValue(isAppLoadState);
  const accountType = useRecoilValue(accountTypeState);
  const congNumber = useRecoilValue(congNumberState);
  const backupAuto = useRecoilValue(backupAutoState);

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

        if (!data) return;

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
            setUserID(data.result.id);
            setCongID(data.result.cong_id);
            setCongConnected(true);
            setIsMFAEnabled(data.result.mfa);

            if (backupAuto) {
              worker.postMessage({ field: 'userID', value: data.result.id });

              worker.postMessage({
                field: 'congID',
                value: data.result.cong_id,
              });

              worker.postMessage({ field: 'accountType', value: 'vip' });

              worker.postMessage('startWorker');
            }
          }

          setAutoLoginStatus('auto login process completed');
        }
      } catch (error) {
        console.error(error);
      }
    };

    handleLoginData();
  }, [
    isPending,
    data,
    error,
    congNumber,
    backupAuto,
    setCongConnected,
    setCongID,
    setUserID,
    setIsMFAEnabled,
  ]);

  return { autoLoginStatus };
};

export default useUserAutoLogin;
