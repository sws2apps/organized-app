import { useEffect, Suspense } from 'react';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import usePwa2 from 'use-pwa2/dist/index.js';
import Box from '@mui/material/Box';
import About from '../features/about';
import RootModal from './RootModal';
import UserAutoLogin from '../features/userAutoLogin';
import { BackupDbDialog, RestoreDbDialog } from '../features/backupRestore';
import { WhatsNew } from '../features/whatsNew';
import {
  backupDbOpenState,
  isAboutOpenState,
  isAppLoadState,
  isCongPersonAddState,
  isOnlineState,
  isWhatsNewOpenState,
  restoreDbOpenState,
} from '../states/main';
import EmailLinkAuthentication from '../features/startup/EmailLinkAuthentication';
import Startup from '../features/startup';
import NavBar from './NavBar';
import { dlgAssDeleteOpenState, dlgAutoFillOpenState, isPublishOpenState } from '../states/schedule';
import { AutofillSchedule, DeleteSchedule, SchedulePublish } from '../features/schedules';
import { isImportEPUBState, isImportJWOrgState } from '../states/sourceMaterial';
import { ImportEPUB, ImportJWOrg } from '../features/sourceMaterial';
import { AppUpdater } from '../features/updater';
import { MyAssignments } from '../features/myAssignments';
import { CongregationPersonAdd } from '../features/congregationPersons';
import { fetchNotifications } from '../api/notification';
import WaitingPage from './WaitingPage';

const Layout = ({ updatePwa }) => {
  let location = useLocation();

  const { enabledInstall, installPwa, isLoading } = usePwa2();

  const [searchParams] = useSearchParams();

  const isEmailAuth = searchParams.get('code') !== null;

  const isAppLoad = useRecoilValue(isAppLoadState);
  const isOpenAbout = useRecoilValue(isAboutOpenState);
  const isOpenWhatsNew = useRecoilValue(isWhatsNewOpenState);
  const isRestoreDb = useRecoilValue(restoreDbOpenState);
  const isBackupDb = useRecoilValue(backupDbOpenState);
  const isDeleteAssignment = useRecoilValue(dlgAssDeleteOpenState);
  const isAutofillAssignment = useRecoilValue(dlgAutoFillOpenState);
  const isPublishPocket = useRecoilValue(isPublishOpenState);
  const isImportEPUB = useRecoilValue(isImportEPUBState);
  const isImportJWOrg = useRecoilValue(isImportJWOrgState);
  const isCongPersonAdd = useRecoilValue(isCongPersonAddState);
  const isOnline = useRecoilValue(isOnlineState);

  const checkPwaUpdate = () => {
    if ('serviceWorker' in navigator) {
      const swUrl = `${import.meta.env.BASE_URL}service-worker.js`;
      navigator.serviceWorker.register(swUrl).then((reg) => {
        reg.update();
      });
    }
  };

  useEffect(() => {
    let fetchTimer;

    if (isOnline) {
      fetchTimer = setTimeout(() => {
        fetchNotifications();
      }, 2000);
    }

    if (import.meta.env.PROD) {
      checkPwaUpdate();
    }

    return () => {
      if (fetchTimer) clearTimeout(fetchTimer);
    };
  }, [isOnline, location]);

  return (
    <RootModal>
      <NavBar enabledInstall={enabledInstall} isLoading={isLoading} installPwa={installPwa} />
      <AppUpdater updatePwa={updatePwa} enabledInstall={enabledInstall} />

      <Box sx={{ padding: '10px' }}>
        <UserAutoLogin />

        {isOpenAbout && <About />}
        {isOpenWhatsNew && <WhatsNew />}
        {isRestoreDb && <RestoreDbDialog />}
        {isBackupDb && <BackupDbDialog />}
        {isDeleteAssignment && <DeleteSchedule />}
        {isAutofillAssignment && <AutofillSchedule />}
        {isPublishPocket && <SchedulePublish />}
        {isImportEPUB && <ImportEPUB />}
        {isImportJWOrg && <ImportJWOrg />}
        {isCongPersonAdd && <CongregationPersonAdd />}

        {isEmailAuth && <EmailLinkAuthentication />}
        {isAppLoad && !isEmailAuth && <Startup />}
        {!isAppLoad && (
          <Suspense fallback={<WaitingPage />}>
            <MyAssignments />
            <Outlet />
          </Suspense>
        )}
      </Box>
    </RootModal>
  );
};

export default Layout;
