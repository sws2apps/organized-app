import { useEffect, useMemo, useRef, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  apiHostState,
  congAccountConnectedState,
  congPrefixState,
  isAppLoadState,
  isMFAEnabledState,
  isOnlineState,
  isSetupState,
  offlineOverrideState,
  userIDState,
} from '@states/app';
import { apiSendAuthorization, apiValidateMe } from '@services/api/user';
import { currentAuthUser, userSignOut } from '@services/firebase/auth';
import { handleDeleteDatabase } from '@services/app';
import { APP_ROLES, isTest, VIP_ROLES } from '@constants/index';
import { accountTypeState, congIDState } from '@states/settings';
import useFirebaseAuth from '@hooks/useFirebaseAuth';
import logger from '@services/logger/index';
import worker from '@services/worker/backupWorker';
import { apiPocketValidateMe } from '@services/api/pocket';
import { displaySnackNotification } from '@services/states/app';
import { IconInfo, IconNoConnection } from '@components/icons';
import { useAppTranslation } from '.';
import {
  dbAppSettingsGet,
  dbAppSettingsUpdate,
  dbAppSettingsUpdateWithoutNotice,
} from '@services/dexie/settings';

const useUserAutoLogin = () => {
  const { isAuthenticated } = useFirebaseAuth();

  const { t } = useAppTranslation();

  const queryClient = useQueryClient();

  // one quiet attempt to re-register this device per missing-cookie episode
  const deviceRestoreTried = useRef(false);

  const setCongConnected = useSetAtom(congAccountConnectedState);
  const setUserID = useSetAtom(userIDState);
  const setCongPrefix = useSetAtom(congPrefixState);
  const setIsMFAEnabled = useSetAtom(isMFAEnabledState);
  const setOfflineOverride = useSetAtom(offlineOverrideState);
  const setIsSetup = useSetAtom(isSetupState);
  const setIsAppLoad = useSetAtom(isAppLoadState);

  const isOnline = useAtomValue(isOnlineState);
  const apiHost = useAtomValue(apiHostState);
  const isAppLoad = useAtomValue(isAppLoadState);
  const accountType = useAtomValue(accountTypeState);
  const congID = useAtomValue(congIDState);

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
    dataUpdatedAt: dataVipUpdatedAt,
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
    dataUpdatedAt: dataPocketUpdatedAt,
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
          const reason = dataVip.result?.message;

          // The Firebase session is fine but the device cookie is gone (Safari
          // caps it to 7 days because the API is on another host). Register
          // this device again with the valid Firebase session instead of
          // signing the user out.
          if (reason === 'DEVICE_REVOKED' && !deviceRestoreTried.current) {
            deviceRestoreTried.current = true;

            const { status } = await apiSendAuthorization();

            if (status === 200) {
              await queryClient.invalidateQueries({ queryKey: ['whoami-vip'] });
              return;
            }
          }

          // a token the server did not accept: refresh it once and check again
          if (reason === 'LOGIN_FIRST' && !deviceRestoreTried.current) {
            deviceRestoreTried.current = true;

            await currentAuthUser()?.getIdToken(true);
            await queryClient.invalidateQueries({ queryKey: ['whoami-vip'] });
            return;
          }

          // revoked from another device, or the account is gone: sign out,
          // and say so instead of leaving the app looking merely offline
          setCongConnected(false);

          displaySnackNotification({
            header: t('tr_deviceSignedOut'),
            message: t('tr_deviceSignedOutDesc'),
            icon: <IconInfo color="var(--white)" />,
          });

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
          deviceRestoreTried.current = false;

          if (congID.length > 0 && dataVip.result.cong_id !== congID) {
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
            const checkRole = prevRole.length > 0;

            const prevNeedMasterKey = prevRole.some((role) =>
              VIP_ROLES.includes(role)
            );

            const newRole = dataVip.result.cong_role;
            const newNeedMasterKey = newRole.some((role) =>
              VIP_ROLES.includes(role)
            );

            if (checkRole && !prevNeedMasterKey && newNeedMasterKey) {
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
                'cong_settings.country_code': dataVip.result.country_code,
                'cong_settings.cong_name': dataVip.result.cong_name,
                'user_settings.cong_role': dataVip.result.cong_role,
                'cong_settings.cong_id': dataVip.result.cong_id,
              });

              setUserID(dataVip.result.id);
              setCongConnected(true);
              setIsMFAEnabled(dataVip.result.mfa);
              setCongPrefix(dataVip.result.cong_prefix);

              worker.postMessage({
                field: 'userID',
                value: dataVip.result.id,
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
    queryClient,
    accountType,
    isPendingVip,
    dataVip,
    // a successful check that returns the same answer as before must still
    // reconnect the account, e.g. after the network came back
    dataVipUpdatedAt,
    errorVip,
    setCongConnected,
    setUserID,
    setIsMFAEnabled,
    setIsAppLoad,
    setIsSetup,
    setOfflineOverride,
    congID,
    setCongPrefix,
  ]);

  useEffect(() => {
    const handleLoginData = async () => {
      try {
        if (isPendingPocket) return;

        if (!dataPocket) return;

        setAutoLoginStatus('auto login process started');

        if (dataPocket.status === 403) {
          // the pocket user was removed: local data belongs to nobody anymore
          if (dataPocket.result?.message === 'ACCOUNT_NOT_FOUND') {
            await handleDeleteDatabase();
            return;
          }

          // Only this device's session cookie is gone (Safari caps it to 7
          // days). The data on the device is still the user's: keep it.
          setCongConnected(false);

          displaySnackNotification({
            header: t('tr_deviceNeedsReconnect'),
            message: t('tr_deviceNeedsReconnectDesc'),
            icon: <IconNoConnection color="var(--always-white)" />,
            severity: 'error',
          });

          return;
        }

        if (errorPocket || dataPocket.result.message) {
          const msg = errorPocket?.message || dataPocket.result.message;
          logger.error('app', msg);

          return;
        }

        if (dataPocket.status === 200) {
          if (
            congID.length > 0 &&
            dataPocket.result.app_settings.cong_settings.id !== congID
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
            setCongConnected(true);

            worker.postMessage({
              field: 'userID',
              value: dataPocket.result.id,
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
    t,
    accountType,
    isPendingPocket,
    dataPocket,
    dataPocketUpdatedAt,
    errorPocket,
    setCongConnected,
    setUserID,
    setIsMFAEnabled,
    congID,
  ]);

  return { autoLoginStatus };
};

export default useUserAutoLogin;
