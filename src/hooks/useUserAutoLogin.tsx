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
import { apiPocketValidateMe } from '@services/api/pocket';

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

  const runFetchVip =
    !isDemo &&
    apiHost !== '' &&
    accountType === 'vip' &&
    !isAppLoad &&
    isOnline &&
    isAuthenticated;

  const runFetchPocket =
    !isDemo &&
    apiHost !== '' &&
    accountType === 'pocket' &&
    !isAppLoad &&
    isOnline;

  const {
    isPending: isPendingVip,
    data: dataVip,
    error: errorVip,
  } = useQuery({
    queryKey: ['whoami-vip'],
    queryFn: apiValidateMe,
    enabled: runFetchVip,
    refetchOnWindowFocus: 'always',
  });

  const {
    isPending: isPendingPocket,
    data: dataPocket,
    error: errorPocket,
  } = useQuery({
    queryKey: ['whoami-pocket'],
    queryFn: apiPocketValidateMe,
    enabled: runFetchPocket,
    refetchOnWindowFocus: 'always',
  });

  const [autoLoginStatus, setAutoLoginStatus] = useState('');

  useEffect(() => {
    const handleLoginData = async () => {
      try {
        if (isPendingVip) {
          setAutoLoginStatus('auto login process started');
          return;
        }

        if (!dataVip) return;

        if (dataVip.status === 403) {
          await userSignOut();
          return;
        }

        // congregation not found -> user not authorized and delete local data
        if (dataVip.status === 404) {
          await handleDeleteDatabase();
          return;
        }

        if (errorVip || dataVip.result.message) {
          const msg = errorVip?.message || dataVip.result.message;
          logger.error('app', msg);

          return;
        }

        if (dataVip.status === 200) {
          if (
            congNumber.length > 0 &&
            dataVip.result.cong_number !== congNumber
          ) {
            await handleDeleteDatabase();
            return;
          }

          const approvedRole = dataVip.result.cong_role.some((role) =>
            APP_ROLES.includes(role)
          );

          if (!approvedRole) {
            await handleDeleteDatabase();
            return;
          }

          if (approvedRole) {
            setUserID(dataVip.result.id);
            setCongID(dataVip.result.cong_id);
            setCongConnected(true);
            setIsMFAEnabled(dataVip.result.mfa);

            if (backupAuto) {
              worker.postMessage({ field: 'userID', value: dataVip.result.id });

              worker.postMessage({
                field: 'congID',
                value: dataVip.result.cong_id,
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

    if (accountType === 'vip') {
      handleLoginData();
    }
  }, [
    accountType,
    isPendingVip,
    dataVip,
    errorVip,
    congNumber,
    backupAuto,
    setCongConnected,
    setCongID,
    setUserID,
    setIsMFAEnabled,
  ]);

  useEffect(() => {
    const handleLoginData = async () => {
      try {
        if (isPendingPocket) {
          setAutoLoginStatus('auto login process started');
          return;
        }

        if (!dataPocket) return;

        // congregation not found -> user not authorized and delete local data

        if (dataPocket.status === 403 || dataPocket.status === 404) {
          await handleDeleteDatabase();
          return;
        }

        if (errorPocket || dataPocket.result.message) {
          const msg = errorPocket?.message || dataPocket.result.message;
          logger.error('app', msg);

          return;
        }

        if (dataPocket.status === 200) {
          if (
            congNumber.length > 0 &&
            dataPocket.result.app_settings.cong_settings.cong_number !==
              congNumber
          ) {
            await handleDeleteDatabase();
            return;
          }

          const approvedRole =
            dataPocket.result.app_settings.user_settings.cong_role.some(
              (role) => APP_ROLES.includes(role)
            );

          if (!approvedRole) {
            await handleDeleteDatabase();
            return;
          }

          if (approvedRole) {
            setUserID(dataPocket.result.id);
            setCongID(dataPocket.result.app_settings.cong_settings.id);
            setCongConnected(true);

            if (backupAuto) {
              worker.postMessage({
                field: 'userID',
                value: dataPocket.result.id,
              });

              worker.postMessage({
                field: 'congID',
                value: dataPocket.result.app_settings.cong_settings.id,
              });

              worker.postMessage({ field: 'accountType', value: 'pocket' });

              worker.postMessage('startWorker');
            }
          }

          setAutoLoginStatus('auto login process completed');
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (accountType === 'pocket') {
      handleLoginData();
    }
  }, [
    accountType,
    isPendingPocket,
    dataPocket,
    errorPocket,
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
