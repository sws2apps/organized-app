import { Box } from '@mui/material';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import useMeetingAttendance from './useMeetingAttendance';
import ExportS88 from '@features/reports/meeting_attendance/export_S88';
import MonthlyHistory from '@features/reports/meeting_attendance/monthly_history';
import MonthlyRecord from '@features/reports/meeting_attendance/monthly_record';
import PageTitle from '@components/page_title';
import QuickSettingsMeetingAttendanceRecord from '@features/reports/meeting_attendance/quick_settings';

const MeetingAttendance = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const { isSecretary, isGroup } = useCurrentUser();

  const {
    quickSettingsOpen,
    handleCloseQuickSettings,
    handleOpenQuickSettings,
  } = useMeetingAttendance();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
      }}
    >
      {quickSettingsOpen && (
        <QuickSettingsMeetingAttendanceRecord
          open={quickSettingsOpen}
          onClose={handleCloseQuickSettings}
        />
      )}

      <PageTitle
        title={t('tr_meetingAttendanceRecord')}
        quickSettings={isSecretary ? handleOpenQuickSettings : null}
        buttons={!isGroup && isSecretary && <ExportS88 />}
      />

      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          flexDirection: desktopUp ? 'row' : 'column',
          alignItems: desktopUp ? 'flex-start' : 'stretch',
        }}
      >
        <MonthlyRecord />
        <MonthlyHistory />
      </Box>
    </Box>
  );
};

export default MeetingAttendance;
