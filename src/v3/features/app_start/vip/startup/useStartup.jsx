import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useFirebaseAuth } from '@hooks/index';
import {
  isCongAccountCreateState,
  isEmailAuthState,
  isEmailLinkAuthenticateState,
  isOnlineState,
  isUserMfaVerifyState,
  isUserSignInState,
  isUserSignUpState,
  offlineOverrideState,
  visitorIDState,
} from '@states/app';
import {
  displaySnackNotification,
  setCongAccountConnected,
  setCurrentMFAStage,
  setIsAppLoad,
  setIsAuthProcessing,
  setIsCongAccountCreate,
  setIsEmailLinkAuthenticate,
  setIsSetup,
  setIsUnauthorizedRole,
  setIsUserSignIn,
  setIsUserSignUp,
  setOfflineOverride,
  setRootModalOpen,
  setShowTermsUse,
  setUserMfaSetup,
  setUserMfaVerify,
} from '@services/recoil/app';
import { congNameState, congRoleState } from '@states/settings';
import { CPE_ROLES } from '@constants/index';
import { loadApp, runUpdater, updateUserInfoAfterLogin } from '@services/cpe';
import { apiSendAuthorization } from '@services/api/user';
import { handleUpdateSetting } from '@services/dexie/settings';
import { apiFetchSchedule } from '@services/api/schedule';
import { handleUpdateScheduleFromRemote } from '@services/cpe/schedules';
import { convertStringToBoolean } from '@utils/common';
import { getMessageByCode } from '@services/i18n/translation';

window.userLoginRan = false;

const useStartup = () => {
  const { isAuthenticated } = useFirebaseAuth();

  const [searchParams] = useSearchParams();

  const isEmailLinkAuth = useRecoilValue(isEmailLinkAuthenticateState);
  const isEmailAuth = useRecoilValue(isEmailAuthState);
  const isOnline = useRecoilValue(isOnlineState);
  const visitorID = useRecoilValue(visitorIDState);
  const isUserSignUp = useRecoilValue(isUserSignUpState);
  const isUserSignIn = useRecoilValue(isUserSignInState);
  const isUserMfaVerify = useRecoilValue(isUserMfaVerifyState);
  const isCongAccountCreate = useRecoilValue(isCongAccountCreateState);
  const isOfflineOverride = useRecoilValue(offlineOverrideState);
  const congName = useRecoilValue(congNameState);
  const congRole = useRecoilValue(congRoleState);

  const showSignin = useCallback(() => {
    setIsUserSignUp(false);
    setIsUserSignIn(true);
    setIsCongAccountCreate(false);
    setUserMfaVerify(false);
    setUserMfaSetup(false);
  }, []);

  const runAuthenticatedStep = useCallback(async () => {
    try {
      setIsAuthProcessing(true);

      const approvedRole = congRole.some((role) => CPE_ROLES.includes(role));

      if (!isOfflineOverride && congName.length > 0 && approvedRole) {
        setIsSetup(false);
        await loadApp();
        await runUpdater();
        setTimeout(() => {
          setIsSetup(false);
          setIsAppLoad(false);
        }, [1000]);
        return;
      }

      if (!window.userLoginRan) {
        window.userLoginRan = true;

        const { status, data } = await apiSendAuthorization();

        if (status !== 200) {
          await displaySnackNotification({
            message: getMessageByCode(data.message),
            severity: 'warning',
          });

          setIsAuthProcessing(false);
          return;
        }

        const result = {};
        const { cong_name, cong_role, mfa } = data;

        if (mfa === 'not_enabled') {
          if (cong_name.length === 0) {
            result.createCongregation = true;
          }

          if (cong_name.length > 0 && cong_role.length === 0) {
            result.unauthorized = true;
          }

          if (cong_name.length > 0 && cong_role.length > 0) {
            const approvedRole = cong_role.some((role) => CPE_ROLES.includes(role));

            if (!approvedRole) {
              result.unauthorized = true;
            }

            if (approvedRole) {
              await updateUserInfoAfterLogin(data);

              result.success = true;
            }
          }
        } else {
          result.isVerifyMFA = true;
        }

        if (result.isVerifyMFA || result.success || result.createCongregation) {
          await handleUpdateSetting({ account_type: 'vip' });

          if (result.isVerifyMFA) {
            setCurrentMFAStage('verify');
            setIsUserSignUp(false);
            setUserMfaVerify(true);
            setIsCongAccountCreate(false);
            setIsUnauthorizedRole(false);
          }

          if (result.success) {
            setIsSetup(false);

            await runUpdater();

            await setRootModalOpen(true);
            const { status: scheduleStatus, data: scheduleData } = await apiFetchSchedule();
            if (scheduleStatus === 200) {
              await handleUpdateScheduleFromRemote(scheduleData);
            }
            await setRootModalOpen(false);

            setTimeout(() => {
              setOfflineOverride(false);
              setCongAccountConnected(true);
              setIsAppLoad(false);
            }, [2000]);
          }

          if (result.createCongregation) {
            setIsUserSignUp(false);
            setIsUserSignIn(false);
            setIsCongAccountCreate(true);
          }
        }

        if (result.unauthorized) {
          setIsUserSignUp(false);
          setUserMfaVerify(true);
          setIsCongAccountCreate(false);
          setIsUnauthorizedRole(true);
        }

        setIsAuthProcessing(false);
      }
    } catch (err) {
      await displaySnackNotification({
        message: getMessageByCode(err.message),
        severity: 'error',
      });

      setIsAuthProcessing(false);
    }
  }, [isOfflineOverride, congName, congRole]);

  const runNotAuthenticatedStep = useCallback(async () => {
    if (isOfflineOverride) {
      showSignin();
      return;
    }

    if (congName.length === 0) {
      showSignin();
      return;
    }

    const approvedRole = congRole.some((role) => CPE_ROLES.includes(role));

    if (!approvedRole) {
      showSignin();
      return;
    }

    if (congName.length > 0) {
      setIsSetup(false);
      await loadApp();
      await runUpdater();
      setTimeout(() => {
        setIsSetup(false);
        setIsAppLoad(false);
      }, [1000]);
    }
  }, [isOfflineOverride, congName, congRole, showSignin]);

  useEffect(() => {
    const checkLink = async () => {
      const value = searchParams.get('code') !== null;
      await setIsEmailLinkAuthenticate(value);
    };

    checkLink();
  }, [searchParams]);

  useEffect(() => {
    if (!isAuthenticated) runNotAuthenticatedStep();
  }, [isAuthenticated, runNotAuthenticatedStep]);

  useEffect(() => {
    if (visitorID.toString().length === 0) return;

    if (isUserSignUp || isUserSignIn) {
      if (isAuthenticated) {
        runAuthenticatedStep();
      }
    }
  }, [isUserSignUp, isUserSignIn, runAuthenticatedStep, visitorID, isAuthenticated, isOnline]);

  useEffect(() => {
    const checkTermsUseStatus = async () => {
      const localValue = convertStringToBoolean(localStorage.getItem('termsUse') || 'true');
      await setShowTermsUse(localValue);
    };

    checkTermsUseStatus();
  }, []);

  return {
    isEmailAuth,
    isUserSignIn,
    isUserMfaVerify,
    isCongAccountCreate,
    isEmailLinkAuth,
  };
};

export default useStartup;
