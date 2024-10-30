import { Box } from '@mui/material';
import { IconPrepareReport } from '@components/icons';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import Button from '@components/button';
import MonthlyHistory from '@features/reports/meeting_attendance/monthly_history';
import MonthlyRecord from '@features/reports/meeting_attendance/monthly_record';
import PageTitle from '@components/page_title';
import useMeetingAttendance from './useMeetingAttendance';
import QuickSettingsMeetingAttendanceRecord from '@features/reports/meeting_attendance/quick_settings';

const MeetingAttendance = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const { isSecretary } = useCurrentUser();

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
        quickAction={isSecretary ? handleOpenQuickSettings : null}
        buttons={
          <>
            {isSecretary && (
              <Button
                variant="main"
                startIcon={<IconPrepareReport />}
                href="#/reports/branch-office"
              >
                {t('tr_createS1')}
              </Button>
            )}
          </>
        }
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
