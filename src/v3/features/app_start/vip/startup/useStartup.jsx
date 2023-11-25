import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useFirebaseAuth } from '@hooks/index';
import {
  isCongAccountCreateState,
  isEmailAuthState,
  isEmailLinkAuthenticateState,
  isUserMfaVerifyState,
  isUserSignInState,
  offlineOverrideState,
} from '@states/app';
import {
  setIsAppLoad,
  setIsCongAccountCreate,
  setIsEmailLinkAuthenticate,
  setIsSetup,
  setIsUserSignIn,
  setIsUserSignUp,
  setShowTermsUse,
  setUserMfaSetup,
  setUserMfaVerify,
} from '@services/recoil/app';
import { congNameState, congRoleState } from '@states/settings';
import { CPE_ROLES } from '@constants/index';
import { loadApp, runUpdater } from '@services/cpe';
import { convertStringToBoolean } from '@utils/common';

const useStartup = () => {
  const { isAuthenticated } = useFirebaseAuth();

  const [searchParams] = useSearchParams();

  const isEmailLinkAuth = useRecoilValue(isEmailLinkAuthenticateState);
  const isEmailAuth = useRecoilValue(isEmailAuthState);
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
