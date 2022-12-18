import { useEffect, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import usePwa2 from 'use-pwa2/dist/index.js';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import About from '../features/about';
import RootModal from './RootModal';
import UserAutoLogin from '../features/userAutoLogin';
import { BackupDbDialog, RestoreDbDialog } from '../features/backupRestore';
import { WhatsNew } from '../features/whatsNew';
import {
  backupDbOpenState,
  isAboutOpenState,
  isAppClosingState,
  isAppLoadState,
  isCongPersonAddState,
  isWhatsNewOpenState,
  restoreDbOpenState,
} from '../states/main';
import Startup from '../features/startup';
import NavBar from './NavBar';
import { dlgAssDeleteOpenState, dlgAutoFillOpenState, isPublishOpenState } from '../states/schedule';
import { AutofillSchedule, DeleteSchedule, SchedulePublish } from '../features/schedules';
import { isImportEPUBState, isImportJWOrgState } from '../states/sourceMaterial';
import { ImportEPUB, ImportJWOrg } from '../features/sourceMaterial';
import { fetchNotifications } from '../utils/app';
import { AppUpdater } from '../features/updater';
import { UserSignOut } from '../features/userSignOut';
import { MyAssignments } from '../features/myAssignments';
import { CongregationPersonAdd } from '../features/congregationPersons';

const WaitingPage = () => {
  return (
    <CircularProgress
      color="primary"
      size={80}
      disableShrink={true}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 'auto',
      }}
    />
  );
};

const Layout = ({ updatePwa }) => {
  let location = useLocation();

  const { enabledInstall, installPwa, isLoading } = usePwa2();

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
  const isAppClosing = useRecoilValue(isAppClosingState);
  const isCongPersonAdd = useRecoilValue(isCongPersonAddState);

  const checkPwaUpdate = () => {
    if ('serviceWorker' in navigator) {
      const swUrl = `${import.meta.env.BASE_URL}service-worker.js`;
      navigator.serviceWorker.register(swUrl).then((reg) => {
        reg.update();
      });
    }
  };

  useEffect(() => {
    fetchNotifications();

    if (import.meta.env.PROD) {
      checkPwaUpdate();
    }
  }, [location]);

  return (
    <RootModal>
      <NavBar enabledInstall={enabledInstall} isLoading={isLoading} installPwa={installPwa} />
      <AppUpdater updatePwa={updatePwa} enabledInstall={enabledInstall} />

      <Box sx={{ padding: '10px' }}>
        <UserAutoLogin />
        <MyAssignments />

        {isOpenAbout && <About />}
        {isOpenWhatsNew && <WhatsNew />}
        {isRestoreDb && <RestoreDbDialog />}
        {isBackupDb && <BackupDbDialog />}
        {isDeleteAssignment && <DeleteSchedule />}
        {isAutofillAssignment && <AutofillSchedule />}
        {isPublishPocket && <SchedulePublish />}
        {isImportEPUB && <ImportEPUB />}
        {isImportJWOrg && <ImportJWOrg />}
        {isAppClosing && <UserSignOut />}
        {isCongPersonAdd && <CongregationPersonAdd />}

        {isAppLoad && <Startup />}
        {!isAppLoad && (
          <Suspense fallback={<WaitingPage />}>
            <Outlet />
          </Suspense>
        )}
      </Box>
    </RootModal>
  );
};

export default Layout;
