import { useEffect, Suspense, lazy } from 'react';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
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
  isEmailLinkAuthenticateState,
  isOnlineState,
  restoreDbOpenState,
  userConfirmationOpenState,
} from '../states/main';
import EmailLinkAuthentication from '../features/startup/vip/EmailLinkAuthentication';
import NavBar from './NavBar';
import {
  S140DownloadOpenState,
  weekendMeetingDownloadOpenState,
  dlgAssDeleteOpenState,
  dlgAutoFillOpenState,
  isPublishOpenState,
  S89DownloadOpenState,
} from '../states/schedule';
import { AutofillSchedule, DeleteSchedule, SchedulePublish } from '../features/schedules';
import { isImportEPUBState, isImportJWOrgState } from '../states/sourceMaterial';
import { ImportEPUB, ImportJWOrg } from '../features/sourceMaterial';
import { AppUpdater } from '../features/updater';
import { MyAssignments } from '../features/myAssignments';
import { CongregationPersonAdd } from '../features/congregationPersons';
import WaitingPage from './WaitingPage';
import Startup from '../features/startup';
import {
  fetchNotifications,
  apiGetPendingFieldServiceReports,
  apiGetCongregationSpeakersRequestsStatus,
  apiGetCongregationSpeakersRequests,
} from '../api';
import { dbSaveNotifications } from '../indexedDb/dbNotifications';
import { WhatsNewContent } from '../features/whatsNew';
import UserConfirmation from './UserConfirmation';
import { classesInitialize } from '../utils/classes';
import { isAddSYOpenState, pendingFieldServiceReportsState } from '../states/report';
import { AddServiceYear } from '../features/serviceYear';
import { Setting } from '../classes/Setting';
import { congAccountConnectedState, congIDState, congSpeakersRequestsState } from '../states/congregation';
import { saveCongregationsSpeakersRequests } from '../utils/visiting_speakers_utils';

await classesInitialize();

const S140DownloadPDF = lazy(() => import('../features/pdfDownload/S140DownloadPDF'));
const WeekendMeetingDownloadPDF = lazy(() => import('../features/pdfDownload/WeekendMeetingDownloadPDF'));
const S89DownloadPDF = lazy(() => import('../features/pdfDownload/S89DownloadPDF'));

const Layout = ({ updatePwa }) => {
  let location = useLocation();

  const { enabledInstall, installPwa, isLoading } = usePwa2();

  const [searchParams] = useSearchParams();

  const [isEmailAuth, setIsEmailAuth] = useRecoilState(isEmailLinkAuthenticateState);

  const setPendingFieldServiceReports = useSetRecoilState(pendingFieldServiceReportsState);
  const setCongSpeakersRequests = useSetRecoilState(congSpeakersRequestsState);

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
  const isWeekendMeetingDownloadPDF = useRecoilValue(weekendMeetingDownloadOpenState);
  const congID = useRecoilValue(congIDState);
  const congAccountConnected = useRecoilValue(congAccountConnectedState);
  const isS89DownloadPDF = useRecoilValue(S89DownloadOpenState);

  const secretaryRole = Setting.cong_role.includes('secretary');
  const publicTalkCoordinatorRole = Setting.cong_role.includes('public_talk_coordinator');

  const { data: announcements } = useQuery({
    queryKey: ['annoucements'],
    queryFn: fetchNotifications,
    refetchInterval: 30000,
    staleTime: 30000,
  });

  const { data: pending_fieldServiceReports } = useQuery({
    enabled: congAccountConnected && secretaryRole && congID !== '',
    queryKey: ['pendingFieldServiceReports'],
    queryFn: apiGetPendingFieldServiceReports,
    refetchInterval: 1 * 60 * 1000,
    staleTime: 1 * 60 * 1000,
  });

  const { data: cong_speakers_requests } = useQuery({
    enabled: congAccountConnected && publicTalkCoordinatorRole && congID !== '',
    queryKey: ['congregationSpeakersRequests'],
    queryFn: apiGetCongregationSpeakersRequests,
    refetchInterval: 15000,
    staleTime: 15000,
  });

  const { data: cong_speakers_requests_status } = useQuery({
    enabled: congAccountConnected && publicTalkCoordinatorRole && congID !== '',
    queryKey: ['congregationSpeakersRequestsStatus'],
    queryFn: apiGetCongregationSpeakersRequestsStatus,
    refetchInterval: 25000,
    staleTime: 25000,
  });

  const checkPwaUpdate = () => {
    if ('serviceWorker' in navigator) {
      const swUrl = `${import.meta.env.BASE_URL}service-worker.js`;
      navigator.serviceWorker.register(swUrl).then((reg) => {
        reg.update();
      });
    }
  };

  useEffect(() => {
    const value = searchParams.get('code') !== null;
    setIsEmailAuth(value);
  }, [setIsEmailAuth, searchParams]);

  useEffect(() => {
    if (import.meta.env.PROD && isOnline) checkPwaUpdate();
  }, [isOnline, location]);

  useEffect(() => {
    if (announcements?.data?.length >= 0) dbSaveNotifications(announcements.data);
  }, [announcements]);

  useEffect(() => {
    if (
      secretaryRole &&
      pending_fieldServiceReports &&
      pending_fieldServiceReports.status === 200 &&
      pending_fieldServiceReports.data
    ) {
      const pendingReports = pending_fieldServiceReports.data;
      setPendingFieldServiceReports(pendingReports);
    }
  }, [secretaryRole, pending_fieldServiceReports, setPendingFieldServiceReports]);

  useEffect(() => {
    if (
      publicTalkCoordinatorRole &&
      cong_speakers_requests &&
      cong_speakers_requests.status === 200 &&
      cong_speakers_requests.data
    ) {
      const congSpeakersRequests = cong_speakers_requests.data;
      setCongSpeakersRequests(congSpeakersRequests);
    }
  }, [publicTalkCoordinatorRole, cong_speakers_requests, setCongSpeakersRequests]);

  useEffect(() => {
    if (
      publicTalkCoordinatorRole &&
      cong_speakers_requests_status &&
      cong_speakers_requests_status.status === 200 &&
      cong_speakers_requests_status.data
    ) {
      const congSpeakersRequestsStatus = cong_speakers_requests_status.data;
      saveCongregationsSpeakersRequests(congSpeakersRequestsStatus);
    }
  }, [publicTalkCoordinatorRole, cong_speakers_requests_status]);

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
        {isWeekendMeetingDownloadPDF && <WeekendMeetingDownloadPDF />}
        {isS89DownloadPDF && <S89DownloadPDF />}

        {isAppLoad && isEmailAuth && <EmailLinkAuthentication />}
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
