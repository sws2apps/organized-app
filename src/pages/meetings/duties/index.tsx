import { Box } from '@mui/material';
import { IconGenerate, IconPublish } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useMeetingDuties from './useDuties';
import DutiesEditor from '@features/meetings/duties_schedule/duties_editor';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';
import PageTitle from '@components/page_title';
import QuickSettingsMeetingDuties from '@features/meetings/duties_schedule/quick_settings';
import WeekSelector from '@features/meetings/week_selector';

const MeetingDuties = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const {
    handleCloseQuickSettings,
    handleOpenQuickSettings,
    quickSettingsOpen,
  } = useMeetingDuties();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      {quickSettingsOpen && (
        <QuickSettingsMeetingDuties
          open={quickSettingsOpen}
          onClose={handleCloseQuickSettings}
        />
      )}

      <PageTitle
        title={t('tr_meetingDutiesSchedules')}
        quickSettings={handleOpenQuickSettings}
        buttons={
          <NavBarButtonGroup>
            {/* autofill and publish arrive with the scheduling logic phase */}
            <NavBarButton
              text={t('tr_autofill')}
              icon={<IconGenerate />}
              disabled
            />
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
