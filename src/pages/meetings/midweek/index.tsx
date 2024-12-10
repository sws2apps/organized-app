import { Box } from '@mui/material';
import { IconGenerate, IconPrint, IconPublish } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useMidweek from './useMidweek';
import Button from '@components/button';
import MidweekEditor from '@features/meetings/midweek_editor';
import MidweekExport from '@features/meetings/midweek_export';
import PageTitle from '@components/page_title';
import QuickSettingsMidweekMeeting from '@features/meetings/midweek_editor/quick_settings';
import SchedulePublish from '@features/meetings/schedule_publish';
import ScheduleAutofillDialog from '@features/meetings/schedule_autofill';
import WeekSelector from '@features/meetings/week_selector';

const MidweekMeeting = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const {
    hasWeeks,
    handleCloseAutofill,
    handleOpenAutofill,
    openAutofill,
    handleCloseExport,
    handleOpenExport,
    openExport,
    handleClosePublish,
    handleOpenPublish,
    openPublish,
    isConnected,
    handleCloseQuickSettings,
    handleOpenQuickSettings,
    quickSettingsOpen,
  } = useMidweek();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
      }}
    >
      {quickSettingsOpen && (
        <QuickSettingsMidweekMeeting
          open={quickSettingsOpen}
          onClose={handleCloseQuickSettings}
        />
      )}

      {openExport && (
        <MidweekExport open={openExport} onClose={handleCloseExport} />
      )}

      {isConnected && openPublish && (
        <SchedulePublish
          type="midweek"
          open={openPublish}
          onClose={handleClosePublish}
        />
      )}

      {openAutofill && (
        <ScheduleAutofillDialog
          meeting="midweek"
          open={openAutofill}
          onClose={handleCloseAutofill}
        />
      )}

      <PageTitle
        title={t('tr_midweekMeeting')}
        quickAction={handleOpenQuickSettings}
        buttons={
          hasWeeks && (
            <>
              <Button
                variant="secondary"
                onClick={handleOpenExport}
                startIcon={<IconPrint />}
              >
                {t('tr_export')}
              </Button>
              <Button
                variant="secondary"
                onClick={handleOpenAutofill}
                startIcon={<IconGenerate />}
              >
                {t('tr_autofill')}
              </Button>
              {isConnected && (
                <Button
                  variant="main"
                  startIcon={<IconPublish />}
                  onClick={handleOpenPublish}
                >
                  {t('tr_publish')}
                </Button>
              )}
            </>
          )
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
        <MidweekEditor />
      </Box>
    </Box>
  );
};

export default MidweekMeeting;
