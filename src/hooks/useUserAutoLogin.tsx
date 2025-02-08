import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import {
  apiHostState,
  congAccountConnectedState,
  congIDState,
  isAppLoadState,
  isMFAEnabledState,
  isOnlineState,
  isSetupState,
  offlineOverrideState,
  userIDState,
} from '@states/app';
import { apiValidateMe } from '@services/api/user';
import { userSignOut } from '@services/firebase/auth';
import { handleDeleteDatabase } from '@services/app';
import { APP_ROLES, isTest, VIP_ROLES } from '@constants/index';
import { accountTypeState, congNumberState } from '@states/settings';
import useFirebaseAuth from '@hooks/useFirebaseAuth';
import logger from '@services/logger/index';
import worker from '@services/worker/backupWorker';
import { apiPocketValidateMe } from '@services/api/pocket';
import { displaySnackNotification } from '@services/recoil/app';
import { IconInfo } from '@components/icons';
import { useAppTranslation } from '.';
import {
  dbAppSettingsGet,
  dbAppSettingsUpdate,
  dbAppSettingsUpdateWithoutNotice,
} from '@services/dexie/settings';

const useUserAutoLogin = () => {
  const { isAuthenticated } = useFirebaseAuth();

  const { t } = useAppTranslation();

  const setCongID = useSetRecoilState(congIDState);
  const setCongConnected = useSetRecoilState(congAccountConnectedState);
  const setUserID = useSetRecoilState(userIDState);
  const setIsMFAEnabled = useSetRecoilState(isMFAEnabledState);
  const setOfflineOverride = useSetRecoilState(offlineOverrideState);
  const setIsSetup = useSetRecoilState(isSetupState);
  const setIsAppLoad = useSetRecoilState(isAppLoadState);

  const isOnline = useRecoilValue(isOnlineState);
  const apiHost = useRecoilValue(apiHostState);
  const isAppLoad = useRecoilValue(isAppLoadState);
  const accountType = useRecoilValue(accountTypeState);
  const congNumber = useRecoilValue(congNumberState);

  const runFetchVip = useMemo(() => {
    return (
      !isTest &&
      apiHost !== '' &&
      accountType === 'vip' &&
      !isAppLoad &&
      isOnline &&
      isAuthenticated
    );
  }, [accountType, apiHost, isAppLoad, isAuthenticated, isOnline]);

  const runFetchPocket = useMemo(() => {
    return (
      !isTest &&
      apiHost !== '' &&
      accountType === 'pocket' &&
      !isAppLoad &&
      isOnline
    );
  }, [accountType, apiHost, isAppLoad, isOnline]);

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
        setAutoLoginStatus('auto login process started');

        if (isPendingVip) return;

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
            const settings = await dbAppSettingsGet();

            const prevRole = settings.user_settings.cong_role;
            const prevNeedMasterKey = prevRole.some((role) =>
              VIP_ROLES.includes(role)
            );

            const newRole = dataVip.result.cong_role;
            const newNeedMasterKey = newRole.some((role) =>
              VIP_ROLES.includes(role)
            );

            if (!prevNeedMasterKey && newNeedMasterKey) {
              displaySnackNotification({
                header: t('tr_userRoleChanged'),
                message: t('tr_userRoleChangedDesc'),
                icon: <IconInfo color="var(--white)" />,
              });

              await dbAppSettingsUpdate({
                'cong_settings.cong_master_key': '',
              });

              await userSignOut();

              setCongConnected(false);
              setIsAppLoad(true);
              setOfflineOverride(true);

              setTimeout(() => {
                setIsSetup(true);
              }, 5000);

              return;
            }

            if (prevNeedMasterKey && !newNeedMasterKey) {
              await handleDeleteDatabase();

              return;
            }

            const proceed =
              !prevNeedMasterKey || prevNeedMasterKey === newNeedMasterKey;

            if (proceed) {
              await dbAppSettingsUpdateWithoutNotice({
                'user_settings.id': dataVip.result.id,
              });

              setUserID(dataVip.result.id);
              setCongID(dataVip.result.cong_id);
              setCongConnected(true);
              setIsMFAEnabled(dataVip.result.mfa);

              worker.postMessage({
                field: 'userID',
                value: dataVip.result.id,
              });

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
    t,
    accountType,
    isPendingVip,
    dataVip,
    errorVip,
    congNumber,
    setCongConnected,
    setCongID,
    setUserID,
    setIsMFAEnabled,
    setIsAppLoad,
    setIsSetup,
    setOfflineOverride,
  ]);

  useEffect(() => {
    const handleLoginData = async () => {
      try {
        if (isPendingPocket) return;

        if (!dataPocket) return;

        setAutoLoginStatus('auto login process started');

        // congregation not found -> user not authorized and delete local data
        if (dataPocket.status === 403) {
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
            await dbAppSettingsUpdateWithoutNotice({
              'user_settings.id': dataPocket.result.id,
            });

            setUserID(dataPocket.result.id);
            setCongID(dataPocket.result.app_settings.cong_settings.id);
            setCongConnected(true);

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
    setCongConnected,
    setCongID,
    setUserID,
    setIsMFAEnabled,
  ]);

  return { autoLoginStatus };
};

export default useUserAutoLogin;
