import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  congregationCreateStepState,
  cookiesConsentState,
  isCongAccountCreateState,
  isEmailLinkAuthenticateState,
  isEmailSentState,
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
} from '@services/states/app';
import {
  congNameState,
  congAccessCodeState,
  congRoleState,
  congMasterKeyState,
  congIDState,
} from '@states/settings';
import { APP_ROLES, VIP_ROLES } from '@constants/index';
import { handleDeleteDatabase, loadApp, runUpdater } from '@services/app';
import { apiValidateMe } from '@services/api/user';
import { userSignOut } from '@services/firebase/auth';
import useFirebaseAuth from '@hooks/useFirebaseAuth';

const useStartup = () => {
  const [searchParams] = useSearchParams();

  const { isAuthenticated } = useFirebaseAuth();

  const [isUserSignIn, setIsUserSignIn] = useAtom(isUserSignInState);

  const setCookiesConsent = useSetAtom(cookiesConsentState);
  const setCongCreate = useSetAtom(isCongAccountCreateState);
  const setCurrentStep = useSetAtom(congregationCreateStepState);

  const isEmailLinkAuth = useAtomValue(isEmailLinkAuthenticateState);
  const isUserMfaVerify = useAtomValue(isUserMfaVerifyState);
  const isUserAccountCreated = useAtomValue(isUserAccountCreatedState);
  const isOfflineOverride = useAtomValue(offlineOverrideState);
  const congName = useAtomValue(congNameState);
  const congRole = useAtomValue(congRoleState);
  const isEncryptionCodeOpen = useAtomValue(isEncryptionCodeOpenState);
  const congAccessCode = useAtomValue(congAccessCodeState);
  const isCongCreate = useAtomValue(isCongAccountCreateState);
  const congMasterKey = useAtomValue(congMasterKeyState);
  const congID = useAtomValue(congIDState);
  const cookiesConsent = useAtomValue(cookiesConsentState);
  const isEmailSent = useAtomValue(isEmailSentState);

  const [isStart, setIsStart] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const isEmailLink = searchParams.get('code') !== null;

  const showSignin = useCallback(() => {
    setIsUserSignIn(!isEmailLink);
    setUserMfaVerify(false);
  }, [setIsUserSignIn, isEmailLink]);

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
        await runUpdater();
        loadApp();
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

      if (congID.length > 0 && result.cong_id !== congID) {
        await handleDeleteDatabase();
        return;
      }

      const remoteMasterKey = result.cong_master_key || '';
      const remoteAccessCode = result.cong_access_code || '';

      if (
        isAuthenticated &&
        (remoteMasterKey.length === 0 || remoteAccessCode.length === 0)
      ) {
        if (masterKeyNeeded && remoteMasterKey.length === 0) {
          setCurrentStep(1);
          setIsLoading(false);
          setIsStart(false);
          setCongCreate(true);
          return;
        }

        if (
          masterKeyNeeded &&
          remoteMasterKey.length > 0 &&
          remoteAccessCode.length === 0
        ) {
          setCurrentStep(2);
          setIsLoading(false);
          setIsStart(false);
          setCongCreate(true);
          return;
        }
      }

      if (
        (masterKeyNeeded && congMasterKey.length === 0) ||
        congAccessCode.length === 0
      ) {
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
    congID,
    setCongCreate,
    setCurrentStep,
    isAuthenticated,
    setIsUserSignIn,
  ]);

  useEffect(() => {
    setIsEmailLinkAuthenticate(isEmailLink);
  }, [isEmailLink]);

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
    isUserSignIn,
    isUserMfaVerify,
    isUserAccountCreated,
    isEmailLinkAuth,
    isEncryptionCodeOpen,
    isCongCreate,
    isLoading,
    isEmailSent,
  };
};

export default useStartup;
