import { Box } from '@mui/material';
import { IconGenerate, IconPrint, IconPublish } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useWeekend from './useWeekend';
import OutgoingTalks from '@features/meetings/outgoing_talks';
import PageTitle from '@components/page_title';
import QuickSettingsWeekendMeeting from '@features/meetings/weekend_editor/quick_settings';
import ScheduleAutofillDialog from '@features/meetings/schedule_autofill';
import SchedulePublish from '@features/meetings/schedule_publish';
import WeekendEditor from '@features/meetings/weekend_editor';
import WeekendExport from '@features/meetings/weekend_export';
import WeekSelector from '@features/meetings/week_selector';
import NavBarButton from '@components/nav_bar_button';

const WeekendMeeting = () => {
  const { t } = useAppTranslation();

  const { desktopUp, tablet688Up } = useBreakpoints();

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
        paddingBottom: !tablet688Up ? '60px' : 'none',
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
        quickSettings={handleOpenQuickSettings}
        buttons={
          hasWeeks && (
            <>
              <NavBarButton
                text={t('tr_export')}
                icon={<IconPrint />}
                onClick={handleOpenExport}
              ></NavBarButton>
              <NavBarButton
                text={t('tr_autofill')}
                icon={<IconGenerate />}
                onClick={handleOpenAutofill}
              ></NavBarButton>
              {isConnected && (
                <NavBarButton
                  text={t('tr_publish')}
                  main
                  icon={<IconPublish />}
                  onClick={handleOpenPublish}
                ></NavBarButton>
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
