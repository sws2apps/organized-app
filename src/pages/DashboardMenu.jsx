import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { fileDialog } from 'file-select-dialog';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import Badge from '@mui/material/Badge';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Grid from '@mui/material/Grid';
import GroupsIcon from '@mui/icons-material/Groups';
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
import { congAccountConnectedState } from '../states/congregation';
import {
  accountTypeState,
  backupDbOpenState,
  isMyAssignmentOpenState,
  isOnlineState,
  isWhatsNewOpenState,
  restoreDbOpenState,
  roleReloadState,
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
import { Setting } from '../classes/Setting';
import { isAddSYOpenState } from '../states/report';

const isDev = process.env.NODE_ENV === 'development';

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
  const roleReload = useRecoilValue(roleReloadState);

  const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');
  const secretaryRole = Setting.cong_role.includes('secretary');
  const adminRole = Setting.cong_role.includes('admin');
  const viewMeetingScheduleRole = Setting.cong_role.includes('view_meeting_schedule');

  const handleOpenMyAssignment = () => {
    setWhatsNewOpen(false);
    setMyAssignmentsOpen(true);
  };

  const handleWeekAdd = async () => {
    setConfirmationTitle(t('sourceMaterial'));
    setConfirmationMessage(t('addWeekDesc'));
    setConfirmationAction('manualWeekAdd');
    setConfirmationOpen(true);
  };

  const handleImportEPUB = async () => {
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
  };

  const handleImportJWOrg = () => {
    setIsImportJWOrg(true);
  };

  const handleCreateBackup = () => {
    setIsBackupDb(true);
  };

  const handleRestoreBackup = () => {
    setIsRestoreDb(true);
  };

  const handlePublishPocket = () => {
    setPublishPocket(true);
  };

  const handleViewCurrentAssignment = async () => {
    let weekDate = await getCurrentExistingWeekDate();
    weekDate = weekDate.replaceAll('/', '-');
    navigate(`/schedules/view/${weekDate}`);
  };

  const handleOpenAddSY = () => {
    setIsAddSY(true);
  };

  const dashboardMenus = [
    {
      title: t('persons'),
      visible: accountType === 'vip' && !viewMeetingScheduleRole,
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
          visible: true,
          navigateTo: '/persons/new',
        },
        {
          title: 'Dummy Import',
          icon: (
            <Badge badgeContent={'D'} color="error">
              <DownloadIcon />
            </Badge>
          ),
          visible: isDev,
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
          title: t('editAssignmentsSchedule'),
          icon: <AssignmentIcon />,
          visible: accountType === 'vip' && lmmoRole,
          navigateTo: '/schedules',
        },
        {
          title: t('publishPocket'),
          icon: <SendIcon />,
          visible: accountType === 'vip' && lmmoRole && isCongAccountConnected ? true : false,
          action: handlePublishPocket,
        },
        {
          title: t('refreshSchedule'),
          icon: <CloudSyncIcon />,
          visible:
            isCongAccountConnected &&
            (accountType === 'pocket' || viewMeetingScheduleRole || (secretaryRole && !lmmoRole)),
          action: apiFetchSchedule,
        },
      ],
    },
    {
      title: t('sourceMaterial'),
      visible: accountType === 'vip' && lmmoRole,
      links: [
        {
          title: t('viewSourceMaterial'),
          icon: <CalendarMonthIcon />,
          visible: true,
          navigateTo: '/source-materials',
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
      visible: accountType === 'vip' && secretaryRole,
      links: [
        {
          title: t('postFieldServiceReport'),
          icon: <NoteIcon />,
          visible: true,
          navigateTo: '/field-service-report',
        },
        {
          title: t('meetingAttendanceRecord'),
          icon: <MeetingRoomIcon />,
          visible: true,
          navigateTo: '/meeting-attendance-record',
        },
        {
          title: t('branchOfficeReport'),
          icon: <ApartmentIcon />,
          visible: true,
          navigateTo: '/branch-office-reports',
        },
        {
          title: t('addPreviousServiceYear'),
          icon: <PostAddIcon />,
          visible: true,
          action: handleOpenAddSY,
        },
      ],
    },
    {
      title: t('congregation'),
      visible: accountType === 'vip' && !viewMeetingScheduleRole,
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
          visible: true,
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
          visible: isCongAccountConnected && adminRole ? true : false,
          navigateTo: '/administration',
        },
      ],
    },
  ];

  useEffect(() => {
    //reload on role refreshed
  }, [roleReload]);

  return (
    <Grid container spacing={2}>
      {dashboardMenus.map((menu) => (
        <MenuCard key={`menu-item-${menu.title}`} menu={menu} />
      ))}
    </Grid>
  );
};

export default DashboardMenu;
