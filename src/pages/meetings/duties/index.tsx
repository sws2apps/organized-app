import { Box } from '@mui/material';
import { IconGenerate, IconPublish } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useMeetingDuties from './useDuties';
import DutiesEditor from '@features/meetings/duties_schedule/duties_editor';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';
import PageTitle from '@components/page_title';
import QuickSettingsMeetingDuties from '@features/meetings/duties_schedule/quick_settings';
import ScheduleAutofillDialog from '@features/meetings/schedule_autofill';
import WeekSelector from '@features/meetings/week_selector';

const MeetingDuties = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const {
    handleCloseQuickSettings,
    handleOpenQuickSettings,
    quickSettingsOpen,
    autofillOpen,
    handleOpenAutofill,
    handleCloseAutofill,
  } = useMeetingDuties();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      {quickSettingsOpen && (
        <QuickSettingsMeetingDuties
          open={quickSettingsOpen}
          onClose={handleCloseQuickSettings}
        />
      )}

      {autofillOpen && (
        <ScheduleAutofillDialog
          meeting="duties"
          open={autofillOpen}
          onClose={handleCloseAutofill}
        />
      )}

      <PageTitle
        title={t('tr_meetingDutiesSchedules')}
        quickSettings={handleOpenQuickSettings}
        buttons={
          <NavBarButtonGroup>
            <NavBarButton
              text={t('tr_autofill')}
              icon={<IconGenerate />}
              onClick={handleOpenAutofill}
            />
            {/* publish arrives with the sync/export phase */}
            <NavBarButton
              text={t('tr_publish')}
              icon={<IconPublish />}
              disabled
            />
          </NavBarButtonGroup>
        }
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: desktopUp ? 'row' : 'column',
          gap: '16px',
          alignItems: desktopUp ? 'flex-start' : 'unset',
        }}
      >
        <WeekSelector />
        <DutiesEditor />
      </Box>
    </Box>
  );
};

export default MeetingDuties;
