import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  congIDState,
  congregationCreateStepState,
  cookiesConsentState,
  isCongAccountCreateState,
  isEmailAuthState,
  isEmailLinkAuthenticateState,
  isEncryptionCodeOpenState,
  isUserAccountCreatedState,
  isUserMfaVerifyState,
  isUserSignInState,
  offlineOverrideState,
} from '@states/app';
import {
  setIsAppLoad,
  setIsEmailLinkAuthenticate,
  setIsEncryptionCodeOpen,
  setIsSetup,
  setUserMfaVerify,
} from '@services/recoil/app';
import {
  congNameState,
  congAccessCodeState,
  congRoleState,
  congMasterKeyState,
  congNumberState,
} from '@states/settings';
import { APP_ROLES, VIP_ROLES } from '@constants/index';
import { handleDeleteDatabase, loadApp, runUpdater } from '@services/app';
import { apiValidateMe } from '@services/api/user';
import { userSignOut } from '@services/firebase/auth';
import useFirebaseAuth from '@hooks/useFirebaseAuth';

const useStartup = () => {
  const [searchParams] = useSearchParams();

  const { isAuthenticated } = useFirebaseAuth();

  const [isUserSignIn, setIsUserSignIn] = useRecoilState(isUserSignInState);

  const setCookiesConsent = useSetRecoilState(cookiesConsentState);
  const setCongCreate = useSetRecoilState(isCongAccountCreateState);
  const setCurrentStep = useSetRecoilState(congregationCreateStepState);
  const setCongID = useSetRecoilState(congIDState);

  const isEmailLinkAuth = useRecoilValue(isEmailLinkAuthenticateState);
  const isEmailAuth = useRecoilValue(isEmailAuthState);
  const isUserMfaVerify = useRecoilValue(isUserMfaVerifyState);
  const isUserAccountCreated = useRecoilValue(isUserAccountCreatedState);
  const isOfflineOverride = useRecoilValue(offlineOverrideState);
  const congName = useRecoilValue(congNameState);
  const congRole = useRecoilValue(congRoleState);
  const isEncryptionCodeOpen = useRecoilValue(isEncryptionCodeOpenState);
  const congAccessCode = useRecoilValue(congAccessCodeState);
  const isCongCreate = useRecoilValue(isCongAccountCreateState);
  const congMasterKey = useRecoilValue(congMasterKeyState);
  const congNumber = useRecoilValue(congNumberState);
  const cookiesConsent = useRecoilValue(cookiesConsentState);

  const [isStart, setIsStart] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const showSignin = useCallback(() => {
    setIsUserSignIn(true);
    setUserMfaVerify(false);
  }, [setIsUserSignIn]);

  const runStartupCheck = useCallback(async () => {
    try {
      setIsLoading(true);

      if (isOfflineOverride) {
        setIsLoading(false);
        setIsStart(false);
        showSignin();
        return;
      }

      if (congName.length === 0) {
        setIsLoading(false);
        setIsStart(false);
        showSignin();
        return;
      }

      const approvedRole = congRole.some((role) => APP_ROLES.includes(role));
      const masterKeyNeeded = congRole.some((role) => VIP_ROLES.includes(role));

      if (!approvedRole) {
        setIsLoading(false);
        setIsStart(false);
        showSignin();
        return;
      }

      const allowOpen =
        (masterKeyNeeded &&
          congMasterKey.length > 0 &&
          congAccessCode.length > 0) ||
        (!masterKeyNeeded && congAccessCode.length > 0);

      if (allowOpen) {
        setIsSetup(false);
        await loadApp();
        await runUpdater();
        setTimeout(() => {
          setIsSetup(false);
          setIsAppLoad(false);
        }, 1000);

        return;
      }

      const { status, result } = await apiValidateMe();

      if (isUserAccountCreated) {
        setIsLoading(false);
        setIsUserSignIn(false);
        return;
      }

      if (!isUserAccountCreated && (status === 403 || status === 400)) {
        await userSignOut();
        setIsLoading(false);
        showSignin();
        return;
      }

      // congregation not found -> user not authorized and delete local data
      if (status === 404) {
        await handleDeleteDatabase();
        return;
      }

      if (status === 200) {
        if (congNumber.length > 0 && result.cong_number !== congNumber) {
          await handleDeleteDatabase();
          return;
        }
      }

      const remoteMasterKey = result.cong_master_key || '';
      const remoteAccessCode = result.cong_access_code || '';

      if (
        isAuthenticated &&
        (remoteMasterKey.length === 0 || remoteAccessCode.length === 0)
      ) {
        setCongID(result.cong_id);

        if (masterKeyNeeded && remoteMasterKey.length === 0) {
          setCurrentStep(1);
        }

        if (
          masterKeyNeeded &&
          remoteMasterKey.length > 0 &&
          remoteAccessCode.length === 0
        ) {
          setCurrentStep(2);
        }

        setIsLoading(false);
        setIsStart(false);
        setCongCreate(true);
        return;
      }

      if (congAccessCode.length === 0 && congName.length > 0) {
        setIsStart(false);
        setIsEncryptionCodeOpen(true);
      }

      setIsStart(false);
      setIsLoading(false);
    } catch (error) {
      showSignin();
      setIsLoading(false);
      console.error(error);
    }
  }, [
    isOfflineOverride,
    isUserAccountCreated,
    congName,
    congRole,
    showSignin,
    congAccessCode,
    congMasterKey,
    congNumber,
    setCongCreate,
    setCongID,
    setCurrentStep,
    isAuthenticated,
    setIsUserSignIn,
  ]);

  useEffect(() => {
    const checkLink = async () => {
      const value = searchParams.get('code') !== null;
      await setIsEmailLinkAuthenticate(value);
    };

    checkLink();
  }, [searchParams]);

  useEffect(() => {
    const checkCookiesConsent = async () => {
      const localValue = Boolean(localStorage.getItem('userConsent'));
      setCookiesConsent(localValue);
    };

    checkCookiesConsent();
  }, [setCookiesConsent]);

  useEffect(() => {
    if (!cookiesConsent) {
      setIsUserSignIn(true);
    }

    if (cookiesConsent && isStart) runStartupCheck();
  }, [setIsUserSignIn, cookiesConsent, isStart, runStartupCheck]);

  return {
    isEmailAuth,
    isUserSignIn,
    isUserMfaVerify,
    isUserAccountCreated,
    isEmailLinkAuth,
    isEncryptionCodeOpen,
    isCongCreate,
    isLoading,
  };
};

export default useStartup;
