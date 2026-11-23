import { useEffect, useMemo, useRef, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { store } from '@states/index';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  apiHostState,
  congAccountConnectedState,
  featureFlagsState,
  congPrefixState,
  isAppLoadState,
  isMFAEnabledState,
  isOnlineState,
  isSetupState,
  offlineOverrideState,
  offlineConfirmedState,
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
import {
  displaySnackNotification,
  retryConnectionNow,
  setAccountAttention,
} from '@services/states/app';
import { IconInfo, IconNoConnection } from '@components/icons';
import { useAppTranslation } from '.';
import {
  dbAppSettingsGet,
  dbAppSettingsUpdate,
  dbAppSettingsUpdateWithoutNotice,
} from '@services/dexie/settings';

// then every 30 s, with jitter so phones don't retry in step
const RECHECK_STEPS = [5000, 10000, 15000, 30000];

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
  const featureFlags = useAtomValue(featureFlagsState);
  const isConnected = useAtomValue(congAccountConnectedState);
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
    errorUpdatedAt: errorVipUpdatedAt,
  } = useQuery({
    queryKey: ['whoami-vip'],
    queryFn: apiValidateMe,
    enabled: runFetchVip,
    refetchOnWindowFocus: 'always',
    // retries are scheduled below, with a backoff that keeps going
    retry: false,
  });

  const {
    isPending: isPendingPocket,
    data: dataPocket,
    error: errorPocket,
    dataUpdatedAt: dataPocketUpdatedAt,
    errorUpdatedAt: errorPocketUpdatedAt,
  } = useQuery({
    queryKey: ['whoami-pocket'],
    queryFn: apiPocketValidateMe,
    enabled: runFetchPocket,
    refetchOnWindowFocus: 'always',
    retry: false,
  });

  // The server could not be reached although the device reports a network
  // (captive portal, server outage): show the account as offline instead of
  // pretending it is connected.
  const failedChecks = useRef(0);
  const firstFailureAt = useRef(0);

  useEffect(() => {
    if (!errorVip && !errorPocket) return;

    setCongConnected(false);

    if (failedChecks.current === 0) firstFailureAt.current = Date.now();
    failedChecks.current += 1;

    // 25 s, not 30: the retry near 30 s is jittered
    const lasting = Date.now() - firstFailureAt.current >= 25000;

    if (
      failedChecks.current >= 3 &&
      lasting &&
      store.get(offlineConfirmedState) === ''
    ) {
      store.set(offlineConfirmedState, 'server');

      displaySnackNotification({
        header: t('tr_cantReachServer'),
        message: t('tr_cantReachServerDesc'),
        icon: <IconNoConnection color="var(--always-white)" />,
        action: { text: t('tr_tryAgain'), onClick: retryConnectionNow },
      });
    }
  }, [
    t,
    errorVip,
    errorPocket,
    errorVipUpdatedAt,
    errorPocketUpdatedAt,
    setCongConnected,
  ]);

  // any answer from the server, even a refusal, means it is reachable again
  useEffect(() => {
    if (!dataVipUpdatedAt && !dataPocketUpdatedAt) return;

    failedChecks.current = 0;

    if (store.get(offlineConfirmedState) === 'server') {
      store.set(offlineConfirmedState, '');

      displaySnackNotification({
        header: t('tr_backOnline'),
        message: t('tr_backOnlineDesc'),
        severity: 'success',
      });
    }
  }, [t, dataVipUpdatedAt, dataPocketUpdatedAt]);

  // A decision from the server that retrying cannot change (signed out,
  // device needs a new sign-in) stops the automatic re-checks below.
  const recheckBlocked = useRef(false);
  const recheckStep = useRef(0);

  useEffect(() => {
    const retryNow = () => {
      recheckStep.current = 0;
      recheckBlocked.current = false;

      const queryKey =
        accountType === 'pocket' ? ['whoami-pocket'] : ['whoami-vip'];

      queryClient.invalidateQueries({ queryKey });
    };

    window.addEventListener('organized:retry-connection', retryNow);

    return () =>
      window.removeEventListener('organized:retry-connection', retryNow);
  }, [accountType, queryClient]);

  // While the account is not connected, keep checking again with a growing
  // delay (2 s up to 1 min) instead of waiting for a restart.
  useEffect(() => {
    if (isConnected) {
      recheckStep.current = 0;
      recheckBlocked.current = false;
      return;
    }

    if (recheckBlocked.current || isAppLoad || !isOnline) return;
    if (accountType === 'vip' && !isAuthenticated) return;
    if (accountType !== 'vip' && accountType !== 'pocket') return;

    const queryKey = accountType === 'vip' ? ['whoami-vip'] : ['whoami-pocket'];

    const base =
      RECHECK_STEPS[Math.min(recheckStep.current, RECHECK_STEPS.length - 1)];
    const delay = base * (0.8 + Math.random() * 0.4);

    const timer = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey });
      recheckStep.current += 1;
    }, delay);

    return () => clearTimeout(timer);
  }, [
    isConnected,
    isAppLoad,
    isOnline,
    accountType,
    isAuthenticated,
    queryClient,
    dataVipUpdatedAt,
    errorVipUpdatedAt,
    dataPocketUpdatedAt,
    errorPocketUpdatedAt,
  ]);

  const [autoLoginStatus, setAutoLoginStatus] = useState('');

  useEffect(() => {
    const handleLoginData = async () => {
      try {
        setAutoLoginStatus('auto login process started');

        // cached answers must not reconnect the account while offline
        if (!isOnline) return;

        if (isPendingVip) return;

        if (!dataVip) return;

        if (dataVip.status === 403) {
          const reason = dataVip.result?.message;

          // The Firebase session is fine but the device cookie is gone (Safari
          // caps it to 7 days because the API is on another host). Register
          // this device again with the valid Firebase session instead of
          // logging the user out.
          //
          // Behind a flag: this is only safe once the API refuses to register
          // a device again with a login that was revoked on purpose (from the
          // sessions list). Without the flag the user is logged out, as
          // before, but now told why.
          if (
            reason === 'DEVICE_REVOKED' &&
            featureFlags['DEVICE_SESSION_RESTORE'] &&
            !deviceRestoreTried.current
          ) {
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
          recheckBlocked.current = true;
          setCongConnected(false);
          setAccountAttention('signin');

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

        // A new session on this device (e.g. after the device cookie was
        // replaced) needs the two-step code again. Say so instead of
        // leaving the account silently offline.
        if (dataVip.status === 401) {
          recheckBlocked.current = true;
          setCongConnected(false);
          setAccountAttention('two-step');

          displaySnackNotification({
            header: t('tr_confirmTwoStep'),
            message: t('tr_confirmTwoStepDesc'),
            icon: <IconInfo color="var(--white)" />,
          });

          return;
        }

        if (errorVip || dataVip.result.message) {
          const msg = errorVip?.message || dataVip.result.message;
          logger.error('app', msg);

          return;
        }

        if (dataVip.status === 200) {
          deviceRestoreTried.current = false;
          setAccountAttention('');

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
    featureFlags,
    accountType,
    isOnline,
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
        if (!isOnline) return;

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
          recheckBlocked.current = true;
          setCongConnected(false);
          setAccountAttention('pocket-reconnect');

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
          setAccountAttention('');
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
    isOnline,
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
