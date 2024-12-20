import { Box } from '@mui/material';
import {
  IconCalendarMonth,
  IconCalendarWeek,
  IconGenerate,
  IconPrint,
  IconPublish,
} from '@components/icons';
import {
  MidweekExport,
  MonthlyView,
  ScheduleAutofillDialog,
  WeekSelector,
} from '@features/index';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useMidweek from './useMidweek';
import Button from '@components/button';
import MidweekEditor from '@features/meetings/midweek_editor';
import PageTitle from '@components/page_title';
import QuickSettingsMidweekMeeting from '@features/meetings/midweek_editor/quick_settings';
import SchedulePublish from '@features/meetings/schedule_publish';

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
    openWeekView,
    handleOpenWeekView,
    handleCloseWeekView,
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
              {openWeekView
                ? desktopUp && (
                    <Button
                      variant="secondary"
                      onClick={handleCloseWeekView}
                      startIcon={<IconCalendarMonth />}
                    >
                      {t('tr_monthlyView')}
                    </Button>
                  )
                : desktopUp && (
                    <Button
                      variant="secondary"
                      onClick={handleOpenWeekView}
                      startIcon={<IconCalendarWeek />}
                    >
                      {t('tr_weeklyView')}
                    </Button>
                  )}

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

      {openWeekView ? (
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
      ) : (
        <MonthlyView />
      )}
    </Box>
  );
};

export default MidweekMeeting;
