import { useRecoilValue } from 'recoil';
import usePwa2 from 'use-pwa2';
import {
  backupDbOpenState,
  isAboutOpenState,
  isAppLoadState,
  isSupportOpenState,
  restoreDbOpenState,
  userConfirmationOpenState,
} from '@states/app';
import { useEffect } from 'react';
import { useUserAutoLogin } from '@hooks/index';
import { isImportEPUBState, isImportJWOrgState } from '@states/sources';
import logger from '@services/logger/index';

const useRootLayout = () => {
  const { installPwa, isLoading } = usePwa2();

  const { autoLoginStatus } = useUserAutoLogin();

  const isAppLoad = useRecoilValue(isAppLoadState);
  const isOpenAbout = useRecoilValue(isAboutOpenState);
  const isImportJWOrg = useRecoilValue(isImportJWOrgState);
  const isImportEPUB = useRecoilValue(isImportEPUBState);
  const isUserConfirm = useRecoilValue(userConfirmationOpenState);
  const isBackupDb = useRecoilValue(backupDbOpenState);
  const isRestoreDb = useRecoilValue(restoreDbOpenState);
  const isOpenSupport = useRecoilValue(isSupportOpenState);

  useEffect(() => {
    if (autoLoginStatus !== '') {
      logger.info('app', autoLoginStatus);
    }
  }, [autoLoginStatus]);

  return {
    installPwa,
    isLoading,
    isAppLoad,
    isOpenAbout,
    isImportJWOrg,
    isImportEPUB,
    isUserConfirm,
    isBackupDb,
    isRestoreDb,
    isOpenSupport,
  };
};

export default useRootLayout;
