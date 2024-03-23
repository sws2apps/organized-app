import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useFirebaseAuth } from '@hooks/index';
import {
  isCongAccountCreateState,
  isEmailAuthState,
  isEmailLinkAuthenticateState,
  isEncryptionCodeOpenState,
  isUserMfaVerifyState,
  isUserSignInState,
  offlineOverrideState,
} from '@states/app';
import {
  setIsAppLoad,
  setIsCongAccountCreate,
  setIsEmailLinkAuthenticate,
  setIsEncryptionCodeOpen,
  setIsSetup,
  setIsUserSignIn,
  setShowTermsUse,
  setUserMfaSetup,
  setUserMfaVerify,
} from '@services/recoil/app';
import { congEncryptionCodeState, congNameState, congRoleState } from '@states/settings';
import { APP_ROLES } from '@constants/index';
import { loadApp, runUpdater } from '@services/app';
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
  const isEncryptionCodeOpen = useRecoilValue(isEncryptionCodeOpenState);
  const congEncryption = useRecoilValue(congEncryptionCodeState);

  const showSignin = useCallback(() => {
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

    const approvedRole = congRole.some((role) => APP_ROLES.includes(role));

    if (!approvedRole) {
      showSignin();
      return;
    }

    if (congName.length > 0 && congEncryption.length === 0) {
      setIsEncryptionCodeOpen(true);
      return;
    }

    if (congName.length > 0 && congEncryption.length > 0) {
      setIsSetup(false);
      await loadApp();
      await runUpdater();
      setTimeout(() => {
        setIsSetup(false);
        setIsAppLoad(false);
      }, 1000);
    }
  }, [isOfflineOverride, congName, congRole, showSignin, congEncryption]);

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
    isEncryptionCodeOpen,
  };
};

export default useStartup;
