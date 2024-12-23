import { Box } from '@mui/material';
import { IconGenerate, IconPrint, IconPublish } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useWeekend from './useWeekend';
import Button from '@components/button';
import OutgoingTalks from '@features/meetings/outgoing_talks';
import PageTitle from '@components/page_title';
import QuickSettingsWeekendMeeting from '@features/meetings/weekend_editor/quick_settings';
import ScheduleAutofillDialog from '@features/meetings/schedule_autofill';
import SchedulePublish from '@features/meetings/schedule_publish';
import WeekendEditor from '@features/meetings/weekend_editor';
import WeekendExport from '@features/meetings/weekend_export';
import WeekSelector from '@features/meetings/week_selector';

const WeekendMeeting = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const {
    hasWeeks,
    openAutofill,
    handleCloseAutofill,
    handleOpenAutofill,
    openExport,
    handleCloseExport,
    handleOpenExport,
    handleClosePublish,
    handleOpenPublish,
    isConnected,
    openPublish,
    handleCloseQuickSettings,
    handleOpenQuickSettings,
    quickSettingsOpen,
  } = useWeekend();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
      }}
    >
      {quickSettingsOpen && (
        <QuickSettingsWeekendMeeting
          open={quickSettingsOpen}
          onClose={handleCloseQuickSettings}
        />
      )}

      {openExport && (
        <WeekendExport open={openExport} onClose={handleCloseExport} />
      )}

      {openAutofill && (
        <ScheduleAutofillDialog
          meeting="weekend"
          open={openAutofill}
          onClose={handleCloseAutofill}
        />
      )}

      {isConnected && openPublish && (
        <SchedulePublish
          type="weekend"
          open={openPublish}
          onClose={handleClosePublish}
        />
      )}

      <PageTitle
        title={t('tr_weekendMeeting')}
        quickAction={handleOpenQuickSettings}
        buttons={
          hasWeeks && (
            <>
              <Button
                variant="secondary"
                startIcon={<IconPrint />}
                onClick={handleOpenExport}
              >
                {t('tr_export')}
              </Button>
              <Button
                variant="secondary"
                startIcon={<IconGenerate />}
                onClick={handleOpenAutofill}
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

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <WeekendEditor />
          <OutgoingTalks />
        </Box>
      </Box>
    </Box>
  );
};

export default WeekendMeeting;
