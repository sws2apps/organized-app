import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import dateFormat from 'dateformat';
import { fileDialog } from 'file-select-dialog';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SendIcon from '@mui/icons-material/Send';
import SettingsIcon from '@mui/icons-material/Settings';
import ScheduleIcon from '@mui/icons-material/Schedule';
import MenuCard from '../components/MenuCard';
import { congAccountConnectedState } from '../states/congregation';
import {
  appLangState,
  backupDbOpenState,
  isMyAssignmentOpenState,
  isOnlineState,
  restoreDbOpenState,
} from '../states/main';
import { dbAddManualSource } from '../indexedDb/dbSourceMaterial';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';
import { epubFileState, isImportEPUBState, isImportJWOrgState } from '../states/sourceMaterial';
import { isPublishOpenState } from '../states/schedule';
import { importDummyUsers } from '../utils/dev';
import { getCurrentWeekDate } from '../utils/app';

const isDev = process.env.NODE_ENV === 'development';

const DashboardMenu = () => {
  const { t } = useTranslation('ui');
  const navigate = useNavigate();

  const appLang = useRecoilValue(appLangState);

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

  const isCongAccountConnected = useRecoilValue(congAccountConnectedState);
  const isOnline = useRecoilValue(isOnlineState);

  const handleOpenMyAssignment = () => {
    setMyAssignmentsOpen(true);
  };

  const handleWeekAdd = async () => {
    await dbAddManualSource();
    setAppSnackOpen(true);
    setAppSeverity('success');
    setAppMessage(t('weekAdded'));
  };

  const handleImportEPUB = async () => {
    const file = await fileDialog({
      accept: '.epub',
      strict: true,
    });

    const epubLang = file.name.split('_')[1];
    if (epubLang && epubLang === appLang.toUpperCase()) {
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

  const handleViewCurrentAssignment = () => {
    let weekDate = getCurrentWeekDate();
    weekDate = dateFormat(weekDate, 'mm-dd-yyyy');
    navigate(`/schedules/view/${weekDate}`);
  };

  const dashboardMenus = [
    {
      title: t('persons'),
      visible: true,
      links: [
        {
          title: t('persons'),
          icon: <PeopleIcon />,
          disabled: false,
          visible: true,
          navigateTo: '/persons',
        },
        {
          title: t('personAdd'),
          icon: <PersonAddIcon />,
          disabled: false,
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
          disabled: false,
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
          disabled: false,
          visible: true,
          action: handleOpenMyAssignment,
        },
        {
          title: t('viewAssignmentsSchedule'),
          icon: <ScheduleIcon />,
          disabled: false,
          visible: true,
          action: handleViewCurrentAssignment,
        },
        {
          title: t('editAssignmentsSchedule'),
          icon: <AssignmentIcon />,
          disabled: false,
          visible: true,
          navigateTo: '/schedules',
        },
        {
          title: t('pulish'),
          icon: <SendIcon />,
          disabled: false,
          visible: isCongAccountConnected ? true : false,
          action: handlePublishPocket,
        },
      ],
    },
    {
      title: t('sourceMaterial'),
      visible: true,
      links: [
        {
          title: t('viewSourceMaterial'),
          icon: <CalendarMonthIcon />,
          disabled: false,
          visible: true,
          navigateTo: '/source-materials',
        },
        {
          title: t('weekAddNew'),
          icon: <MoreTimeIcon />,
          disabled: false,
          visible: true,
          action: handleWeekAdd,
        },
        {
          title: t('sourceImportEPUB'),
          icon: <FileCopyIcon />,
          disabled: false,
          visible: true,
          action: handleImportEPUB,
        },
        {
          title: t('sourceImportJw'),
          icon: <CloudSyncIcon />,
          disabled: false,
          visible: isOnline ? true : false,
          action: handleImportJWOrg,
        },
      ],
    },
    {
      title: t('congregation'),
      visible: true,
      links: [
        {
          title: t('sendBackup'),
          icon: <CloudUploadIcon />,
          disabled: false,
          visible: isCongAccountConnected ? true : false,
          action: handleCreateBackup,
        },
        {
          title: t('restoreBackup'),
          icon: <CloudDownloadIcon />,
          disabled: false,
          visible: isCongAccountConnected ? true : false,
          action: handleRestoreBackup,
        },
        {
          title: t('manageAccessToApps'),
          icon: <AccountCircleIcon />,
          disabled: false,
          visible: isCongAccountConnected ? true : false,
          navigateTo: '/administration',
        },
        {
          title: t('settings'),
          icon: <SettingsIcon />,
          disabled: false,
          visible: true,
          navigateTo: '/congregation-settings',
        },
      ],
    },
  ];

  return (
    <Box sx={{ padding: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {dashboardMenus.map((menu) => (
        <MenuCard key={`menu-item-${menu.title}`} menu={menu} />
      ))}
    </Box>
  );
};

export default DashboardMenu;
