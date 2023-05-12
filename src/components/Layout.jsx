import { useEffect, Suspense, lazy } from 'react';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';
import usePwa2 from 'use-pwa2/dist/index.js';
import Box from '@mui/material/Box';
import About from '../features/about';
import RootModal from './RootModal';
import UserAutoLogin from '../features/userAutoLogin';
import { BackupDbDialog, RestoreDbDialog } from '../features/backupRestore';
import {
  accountTypeState,
  backupDbOpenState,
  isAboutOpenState,
  isAppLoadState,
  isCongPersonAddState,
  isOnlineState,
  restoreDbOpenState,
  userConfirmationOpenState,
} from '../states/main';
import EmailLinkAuthentication from '../features/startup/vip/EmailLinkAuthentication';
import NavBar from './NavBar';
import {
  S140DownloadOpenState,
  dlgAssDeleteOpenState,
  dlgAutoFillOpenState,
  isPublishOpenState,
} from '../states/schedule';
import { AutofillSchedule, DeleteSchedule, SchedulePublish } from '../features/schedules';
import { isImportEPUBState, isImportJWOrgState } from '../states/sourceMaterial';
import { ImportEPUB, ImportJWOrg } from '../features/sourceMaterial';
import { AppUpdater } from '../features/updater';
import { MyAssignments } from '../features/myAssignments';
import { CongregationPersonAdd } from '../features/congregationPersons';
import WaitingPage from './WaitingPage';
import Startup from '../features/startup';
import { fetchNotifications } from '../api';
import { dbSaveNotifications } from '../indexedDb/dbNotifications';
import { WhatsNewContent } from '../features/whatsNew';
import UserConfirmation from './UserConfirmation';
import { classesInitialize } from '../utils/classes';
import { isAddSYOpenState } from '../states/report';
import { AddServiceYear } from '../features/serviceYear';

await classesInitialize();

const S140DownloadPDF = lazy(() => import('../features/pdfDownload/S140DownloadPDF'));

const Layout = ({ updatePwa }) => {
  let location = useLocation();

  const { data: announcements } = useQuery({
    queryKey: ['annoucements'],
    queryFn: fetchNotifications,
    refetchInterval: 60000,
  });

  const { enabledInstall, installPwa, isLoading } = usePwa2();

  const [searchParams] = useSearchParams();

  const isEmailAuth = searchParams.get('code') !== null;

  const isAppLoad = useRecoilValue(isAppLoadState);
  const isOpenAbout = useRecoilValue(isAboutOpenState);
  const isRestoreDb = useRecoilValue(restoreDbOpenState);
  const isBackupDb = useRecoilValue(backupDbOpenState);
  const isDeleteAssignment = useRecoilValue(dlgAssDeleteOpenState);
  const isAutofillAssignment = useRecoilValue(dlgAutoFillOpenState);
  const isPublishPocket = useRecoilValue(isPublishOpenState);
  const isImportEPUB = useRecoilValue(isImportEPUBState);
  const isImportJWOrg = useRecoilValue(isImportJWOrgState);
  const isCongPersonAdd = useRecoilValue(isCongPersonAddState);
  const isOnline = useRecoilValue(isOnlineState);
  const isUserConfirm = useRecoilValue(userConfirmationOpenState);
  const accountType = useRecoilValue(accountTypeState);
  const isAddSY = useRecoilValue(isAddSYOpenState);
  const isS140DownloadPDF = useRecoilValue(S140DownloadOpenState);

  const checkPwaUpdate = () => {
    if ('serviceWorker' in navigator) {
      const swUrl = `${import.meta.env.BASE_URL}service-worker.js`;
      navigator.serviceWorker.register(swUrl).then((reg) => {
        reg.update();
      });
    }
  };

  useEffect(() => {
    if (import.meta.env.PROD && isOnline) checkPwaUpdate();
  }, [isOnline, location]);

  useEffect(() => {
    if (announcements?.data?.length >= 0) dbSaveNotifications(announcements.data);
  }, [announcements]);

  return (
    <RootModal>
      <NavBar enabledInstall={enabledInstall} isLoading={isLoading} installPwa={installPwa} />
      <AppUpdater updatePwa={updatePwa} enabledInstall={enabledInstall} />

      <Box sx={{ padding: '10px' }}>
        {accountType === 'vip' && <UserAutoLogin />}
        <WhatsNewContent />
        {isOpenAbout && <About />}
        {isRestoreDb && <RestoreDbDialog />}
        {isBackupDb && <BackupDbDialog />}
        {isDeleteAssignment && <DeleteSchedule />}
        {isAutofillAssignment && <AutofillSchedule />}
        {isPublishPocket && <SchedulePublish />}
        {isImportEPUB && <ImportEPUB />}
        {isImportJWOrg && <ImportJWOrg />}
        {isCongPersonAdd && <CongregationPersonAdd />}
        {isUserConfirm && <UserConfirmation />}
        {isAddSY && <AddServiceYear />}
        {isS140DownloadPDF && <S140DownloadPDF />}

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
