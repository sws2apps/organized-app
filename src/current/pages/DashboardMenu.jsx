import { lazy, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { fileDialog } from 'file-select-dialog';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Grid from '@mui/material/Grid';
import GroupsIcon from '@mui/icons-material/Groups';
import HailIcon from '@mui/icons-material/Hail';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import NoteIcon from '@mui/icons-material/Note';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SendIcon from '@mui/icons-material/Send';
import SettingsIcon from '@mui/icons-material/Settings';
import ScheduleIcon from '@mui/icons-material/Schedule';
import MenuCard from '../components/MenuCard';
import { congAccountConnectedState, congRoleState } from '../states/congregation';
import {
  accountTypeState,
  backupDbOpenState,
  isMyAssignmentOpenState,
  isOnlineState,
  isWhatsNewOpenState,
  restoreDbOpenState,
  sourceLangState,
  userConfirmationActionState,
  userConfirmationMessageState,
  userConfirmationOpenState,
  userConfirmationTitleState,
} from '../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';
import { epubFileState, isImportEPUBState, isImportJWOrgState } from '../states/sourceMaterial';
import { isPublishOpenState } from '../states/schedule';
import { importDummyUsers } from '../utils/dev';
import { getCurrentExistingWeekDate } from '../utils/app';
import { apiFetchSchedule } from '../api';
import { isAddSYOpenState } from '../states/report';

const isDev = process.env.NODE_ENV === 'development';

const AppReminder = lazy(() => import('../features/reminders/AppReminder'));

const DashboardMenu = () => {
  const { t } = useTranslation('ui');
  const navigate = useNavigate();

  const sourceLang = useRecoilValue(sourceLangState);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setEpubFile = useSetRecoilState(epubFileState);
  const setIsImportEPUB = useSetRecoilState(isImportEPUBState);
  const setIsImportJWOrg = useSetRecoilState(isImportJWOrgState);
  const setIsBackupDb = useSetRecoilState(backupDbOpenState);
  const setIsRestoreDb = useSetRecoilState(restoreDbOpenState);
  const setMyAssignmentsOpen = useSetRecoilState(isMyAssignmentOpenState);
  const setPublishPocket = useSetRecoilState(isPublishOpenState);
  const setWhatsNewOpen = useSetRecoilState(isWhatsNewOpenState);
  const setConfirmationTitle = useSetRecoilState(userConfirmationTitleState);
  const setConfirmationMessage = useSetRecoilState(userConfirmationMessageState);
  const setConfirmationAction = useSetRecoilState(userConfirmationActionState);
  const setConfirmationOpen = useSetRecoilState(userConfirmationOpenState);
  const setIsAddSY = useSetRecoilState(isAddSYOpenState);

  const isCongAccountConnected = useRecoilValue(congAccountConnectedState);
  const isOnline = useRecoilValue(isOnlineState);
  const accountType = useRecoilValue(accountTypeState);
  const congRole = useRecoilValue(congRoleState);

  const lmmoRole = congRole.includes('lmmo') || congRole.includes('lmmo-backup');
  const secretaryRole = congRole.includes('secretary');
  const publicTalkCoordinatorRole = congRole.includes('public_talk_coordinator');
  const coordinatorRole = congRole.includes('coordinator');
  const adminRole = congRole.includes('admin');
  const elderRole = congRole.includes('elder');
  const msRole = congRole.includes('ms');
  const publisherRole =
    congRole.includes('publisher') ||
    msRole ||
    elderRole ||
    lmmoRole ||
    secretaryRole ||
    coordinatorRole ||
    publicTalkCoordinatorRole;
  const fullMeetingEditor = lmmoRole && publicTalkCoordinatorRole && coordinatorRole;

  const handleOpenMyAssignment = useCallback(() => {
    setWhatsNewOpen(false);
    setMyAssignmentsOpen(true);
  }, [setWhatsNewOpen, setMyAssignmentsOpen]);

  const handleWeekAdd = useCallback(async () => {
    setConfirmationTitle(t('sourceMaterial'));
    setConfirmationMessage(t('addWeekDesc'));
    setConfirmationAction('manualWeekAdd');
    setConfirmationOpen(true);
  }, [setConfirmationTitle, setConfirmationMessage, setConfirmationAction, setConfirmationOpen, t]);

  const handleImportEPUB = useCallback(async () => {
    const file = await fileDialog({
      accept: '.epub',
      strict: true,
    });

    const epubLang = file.name.split('_')[1];
    if (epubLang && epubLang === sourceLang.toUpperCase()) {
      setEpubFile(file);
      setIsImportEPUB(true);
    } else {
      setAppSnackOpen(true);
      setAppSeverity('warning');
      setAppMessage(t('invalidFilename'));
    }
  }, [t, setAppSnackOpen, setAppSeverity, setAppMessage, setEpubFile, setIsImportEPUB, sourceLang]);

  const handleImportJWOrg = useCallback(() => {
    setIsImportJWOrg(true);
  }, [setIsImportJWOrg]);

  const handleCreateBackup = useCallback(() => {
    setIsBackupDb(true);
  }, [setIsBackupDb]);

  const handleRestoreBackup = useCallback(() => {
    setIsRestoreDb(true);
  }, [setIsRestoreDb]);

  const handlePublishPocket = useCallback(() => {
    setPublishPocket(true);
  }, [setPublishPocket]);

  const handleViewCurrentAssignment = useCallback(async () => {
    let weekDate = await getCurrentExistingWeekDate();
    weekDate = weekDate.replaceAll('/', '-');
    navigate(`/schedules/view/${weekDate}`);
  }, [navigate]);

  const handleOpenAddSY = useCallback(() => {
    setIsAddSY(true);
  }, [setIsAddSY]);

  const dashboardMenus = useMemo(() => {
    return [
      {
        title: t('persons'),
        visible:
          accountType === 'vip' &&
          (lmmoRole || secretaryRole || elderRole || coordinatorRole || publicTalkCoordinatorRole),
        links: [
          {
            title: t('persons'),
            icon: <PeopleIcon />,
            visible: true,
            navigateTo: '/persons',
          },
          {
            title: t('personAdd'),
            icon: <PersonAddIcon />,
            visible: lmmoRole || secretaryRole || coordinatorRole || publicTalkCoordinatorRole,
            navigateTo: '/persons/new',
          },
          {
            title: t('visitingSpeakers'),
            icon: <HailIcon />,
            visible: coordinatorRole || publicTalkCoordinatorRole,
            navigateTo: '/visiting-speakers',
          },
          {
            title: 'Dummy Import',
            icon: (
              <Badge badgeContent={'D'} color="error">
                <DownloadIcon />
              </Badge>
            ),
            visible: isDev && (lmmoRole || secretaryRole || coordinatorRole || publicTalkCoordinatorRole),
            action: importDummyUsers,
          },
        ],
      },
      {
        title: t('schedule'),
        visible: true,
        links: [
          {
            title: t('viewMyAssignments'),
            icon: <AssignmentIndIcon />,
            visible: true,
            action: handleOpenMyAssignment,
          },
          {
            title: t('viewAssignmentsSchedule'),
            icon: <ScheduleIcon />,
            visible: true,
            action: handleViewCurrentAssignment,
          },
          {
            title: t('midweekMeeting'),
            icon: <AssignmentIcon />,
            visible: accountType === 'vip' && lmmoRole,
            navigateTo: '/schedules',
          },
          {
            title: t('weekendMeeting'),
            icon: <CalendarMonthIcon />,
            visible: accountType === 'vip' && (coordinatorRole || publicTalkCoordinatorRole),
            navigateTo: '/weekend-schedules',
          },
          {
            title: t('publishPocket'),
            icon: <SendIcon />,
            visible:
              accountType === 'vip' &&
              (lmmoRole || coordinatorRole || publicTalkCoordinatorRole) &&
              isCongAccountConnected,
            action: handlePublishPocket,
          },
          {
            title: t('refreshSchedule'),
            icon: <CloudSyncIcon />,
            visible: isCongAccountConnected && !fullMeetingEditor,
            action: apiFetchSchedule,
          },
        ],
      },
      {
        title: t('sourceMaterial'),
        visible: accountType === 'vip' && (lmmoRole || coordinatorRole || publicTalkCoordinatorRole),
        links: [
          {
            title: t('viewSourceMaterial'),
            icon: <CalendarMonthIcon />,
            visible: true,
            navigateTo: '/source-materials',
          },
          {
            title: t('publicTalksList'),
            icon: <ListAltIcon />,
            visible: publicTalkCoordinatorRole,
            navigateTo: '/public-talks',
          },
          {
            title: t('weekAddNew'),
            icon: <MoreTimeIcon />,
            visible: true,
            action: handleWeekAdd,
          },
          {
            title: t('sourceImportEPUB'),
            icon: <FileCopyIcon />,
            visible: true,
            action: handleImportEPUB,
          },
          {
            title: t('sourceImportJw'),
            icon: <CloudSyncIcon />,
            visible: isOnline ? true : false,
            action: handleImportJWOrg,
          },
        ],
      },
      {
        title: t('reports'),
        visible: secretaryRole || publisherRole,
        links: [
          {
            title: t('myReports'),
            icon: <ListAltIcon />,
            visible: publisherRole,
            navigateTo: '/user-field-service-reports',
          },
          {
            title: t('myBibleStudies'),
            icon: <AutoStoriesIcon />,
            visible: publisherRole,
            navigateTo: '/user-bible-studies',
          },
          {
            title: t('postFieldServiceReport'),
            icon: <NoteIcon />,
            visible: accountType === 'vip' && secretaryRole,
            navigateTo: '/field-service-report',
          },
          {
            title: t('meetingAttendanceRecord'),
            icon: <MeetingRoomIcon />,
            visible: accountType === 'vip' && secretaryRole,
            navigateTo: '/meeting-attendance-record',
          },
          {
            title: t('branchOfficeReport'),
            icon: <ApartmentIcon />,
            visible: accountType === 'vip' && secretaryRole,
            navigateTo: '/branch-office-reports',
          },
          {
            title: t('addPreviousServiceYear'),
            icon: <PostAddIcon />,
            visible: accountType === 'vip' && secretaryRole,
            action: handleOpenAddSY,
          },
        ],
      },
      {
        title: t('congregation'),
        visible:
          adminRole ||
          lmmoRole ||
          secretaryRole ||
          coordinatorRole ||
          publicTalkCoordinatorRole ||
          (publisherRole && isCongAccountConnected),
        links: [
          {
            title: t('fieldServiceGroup'),
            icon: <GroupsIcon />,
            visible: secretaryRole,
            navigateTo: '/field-service-group',
          },
          {
            title: t('settings'),
            icon: <SettingsIcon />,
            visible: lmmoRole || secretaryRole || coordinatorRole || publicTalkCoordinatorRole,
            navigateTo: '/congregation-settings',
          },
          {
            title: t('sendBackup'),
            icon: <CloudUploadIcon />,
            visible: isCongAccountConnected ? true : false,
            action: handleCreateBackup,
          },
          {
            title: t('restoreBackup'),
            icon: <CloudDownloadIcon />,
            visible: isCongAccountConnected ? true : false,
            action: handleRestoreBackup,
          },
          {
            title: t('manageAccessToApps'),
            icon: <AccountCircleIcon />,
            visible: isCongAccountConnected && adminRole,
            navigateTo: '/administration',
          },
        ],
      },
    ];
  }, [
    accountType,
    adminRole,
    handleCreateBackup,
    handleImportEPUB,
    handleImportJWOrg,
    handleOpenAddSY,
    handleOpenMyAssignment,
    handlePublishPocket,
    handleRestoreBackup,
    handleViewCurrentAssignment,
    handleWeekAdd,
    isCongAccountConnected,
    isOnline,
    lmmoRole,
    secretaryRole,
    t,
    publisherRole,
    elderRole,
    publicTalkCoordinatorRole,
    coordinatorRole,
    fullMeetingEditor,
  ]);

  return (
    <Box>
      <AppReminder />
      <Grid container spacing={2}>
        {dashboardMenus.map((menu) => (
          <MenuCard key={`menu-item-${menu.title}`} menu={menu} />
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardMenu;
