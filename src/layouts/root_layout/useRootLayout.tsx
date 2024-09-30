import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import usePwa2 from 'use-pwa2';
import {
  backupDbOpenState,
  isAboutOpenState,
  isAppLoadState,
  isContactOpenState,
  isOnlineState,
  isSupportOpenState,
  restoreDbOpenState,
  userConfirmationOpenState,
} from '@states/app';
import { useEffect } from 'react';
import { useUserAutoLogin } from '@hooks/index';
import { isImportEPUBState, isImportJWOrgState } from '@states/sources';
import { checkPwaUpdate } from '@services/app';
import logger from '@services/logger/index';

const useRootLayout = () => {
  const location = useLocation();

  const { installPwa, isLoading } = usePwa2();

  const { autoLoginStatus } = useUserAutoLogin();

  const isAppLoad = useRecoilValue(isAppLoadState);
  const isOpenContact = useRecoilValue(isContactOpenState);
  const isOpenAbout = useRecoilValue(isAboutOpenState);
  const isImportJWOrg = useRecoilValue(isImportJWOrgState);
  const isImportEPUB = useRecoilValue(isImportEPUBState);
  const isUserConfirm = useRecoilValue(userConfirmationOpenState);
  const isBackupDb = useRecoilValue(backupDbOpenState);
  const isRestoreDb = useRecoilValue(restoreDbOpenState);
  const isOpenSupport = useRecoilValue(isSupportOpenState);
  const isOnline = useRecoilValue(isOnlineState);

  const isDashboard = location.pathname === '/';

  useEffect(() => {
    if (import.meta.env.PROD && isOnline) checkPwaUpdate();
  }, [isOnline, location]);

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
    isOpenContact,
    isImportJWOrg,
    isImportEPUB,
    isUserConfirm,
    isBackupDb,
    isRestoreDb,
    isOpenSupport,
    isDashboard,
  };
};

export default useRootLayout;
