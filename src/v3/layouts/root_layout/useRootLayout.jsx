import { useRecoilState, useRecoilValue } from 'recoil';
import { useSearchParams } from 'react-router-dom';
import usePwa2 from 'use-pwa2';
import {
  backupDbOpenState,
  isAboutOpenState,
  isAppLoadState,
  isEmailLinkAuthenticateState,
  restoreDbOpenState,
  userConfirmationOpenState,
} from '@states/app';
import { useEffect } from 'react';
import { useUserAutoLogin } from '@hooks/index';
import { isImportEPUBState, isImportJWOrgState } from '@states/sources';
import logger from '@services/logger';

const useRootLayout = () => {
  const { enabledInstall, installPwa, isLoading } = usePwa2();

  const [searchParams] = useSearchParams();

  const { autoLoginStatus } = useUserAutoLogin();

  const [isEmailAuth, setIsEmailAuth] = useRecoilState(isEmailLinkAuthenticateState);

  const isAppLoad = useRecoilValue(isAppLoadState);
  const isOpenAbout = useRecoilValue(isAboutOpenState);
  const isImportJWOrg = useRecoilValue(isImportJWOrgState);
  const isImportEPUB = useRecoilValue(isImportEPUBState);
  const isUserConfirm = useRecoilValue(userConfirmationOpenState);
  const isBackupDb = useRecoilValue(backupDbOpenState);
  const isRestoreDb = useRecoilValue(restoreDbOpenState);

  useEffect(() => {
    const value = searchParams.get('code') !== null;
    setIsEmailAuth(value);
  }, [setIsEmailAuth, searchParams]);

  useEffect(() => {
    if (autoLoginStatus !== '') {
      logger.info('app', autoLoginStatus);
    }
  }, [autoLoginStatus]);

  return {
    enabledInstall,
    installPwa,
    isLoading,
    isAppLoad,
    isEmailAuth,
    isOpenAbout,
    isImportJWOrg,
    isImportEPUB,
    isUserConfirm,
    isBackupDb,
    isRestoreDb,
  };
};

export default useRootLayout;
