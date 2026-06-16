import { Box } from '@mui/material';
import {
  IconGenerate,
  IconPrint,
  IconPublish,
  IconCalendarMonth,
  IconCalendarWeek,
} from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useMidweek from './useMidweek';
import MidweekEditor from '@features/meetings/midweek_editor';
import MidweekExport from '@features/meetings/midweek_export';
import MonthlyView from '@features/meetings/monthly_view';
import PageTitle from '@components/page_title';
import QuickSettingsMidweekMeeting from '@features/meetings/midweek_editor/quick_settings';
import SchedulePublish from '@features/meetings/schedule_publish';
import ScheduleAutofillDialog from '@features/meetings/schedule_autofill';
import WeekSelector from '@features/meetings/week_selector';
import NavBarButton from '@components/nav_bar_button';

const MidweekMeeting = () => {
  const { t } = useAppTranslation();

  const { desktopUp, tablet688Up } = useBreakpoints();

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
        paddingBottom: !tablet688Up ? '60px' : '0px',
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
        quickSettings={handleOpenQuickSettings}
        buttons={
          hasWeeks && (
            <>
              {openWeekView
                ? desktopUp && (
                    <NavBarButton
                      text={t('tr_monthlyView')}
                      onClick={handleCloseWeekView}
                      icon={<IconCalendarMonth />}
                    ></NavBarButton>
                  )
                : desktopUp && (
                    <NavBarButton
                      text={t('tr_weeklyView')}
                      onClick={handleOpenWeekView}
                      icon={<IconCalendarWeek />}
                    ></NavBarButton>
                  )}

              <NavBarButton
                text={t('tr_export')}
                onClick={handleOpenExport}
                icon={<IconPrint />}
              ></NavBarButton>
              <NavBarButton
                text={t('tr_autofill')}
                onClick={handleOpenAutofill}
                icon={<IconGenerate />}
              ></NavBarButton>
              {isConnected && (
                <NavBarButton
                  text={t('tr_publish')}
                  icon={<IconPublish />}
                  onClick={handleOpenPublish}
                ></NavBarButton>
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
