import { Box } from '@mui/material';
import { IconAdd } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useCircuitOverseerVisit from './useCircuitOverseerVisit';
import DayAgenda from '@features/activities/circuit_overseer_visit/day_agenda';
import ExportVisit from '@features/activities/circuit_overseer_visit/export_visit';
import InfoNote from '@components/info_note';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';
import PageTitle from '@components/page_title';
import QuickSettingsCircuitOverseerVisit from '@features/activities/circuit_overseer_visit/quick_settings';
import VisitDetails from '@features/activities/circuit_overseer_visit/visit_details';
import VisitList from '@features/activities/circuit_overseer_visit/visit_list';

const CircuitOverseerVisit = () => {
  const { t } = useAppTranslation();

  const { desktopUp, tablet688Up } = useBreakpoints();

  const {
    isAdmin,
    visits,
    visit,
    events,
    days,
    day,
    visitDialog,
    quickSettingsOpen,
    handleSelectVisit,
    handleSelectDay,
    handleAddVisit,
    handleEditVisit,
    handleCloseVisitDialog,
    handleOpenQuickSettings,
    handleCloseQuickSettings,
  } = useCircuitOverseerVisit();

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
        <QuickSettingsCircuitOverseerVisit
          open={quickSettingsOpen}
          onClose={handleCloseQuickSettings}
        />
      )}

      {visitDialog !== undefined && (
        <VisitDetails
          visit={visitDialog ?? undefined}
          onClose={handleCloseVisitDialog}
          onSaved={handleSelectVisit}
        />
      )}

      <PageTitle
        title={t('tr_COVisitSchedule')}
        quickSettings={isAdmin ? handleOpenQuickSettings : undefined}
        buttons={
          (visit || isAdmin) && (
            <NavBarButtonGroup>
              {visit && <ExportVisit visit={visit} events={events} />}
              {isAdmin && (
                <NavBarButton
                  main
                  text={t('tr_add')}
                  icon={<IconAdd />}
                  onClick={handleAddVisit}
                />
              )}
            </NavBarButtonGroup>
          )
        }
      />

      {visits.length === 0 && (
        <InfoNote
          variant="card"
          message={t(isAdmin ? 'tr_COVisitsEmptyAdmin' : 'tr_COVisitsEmpty')}
        />
      )}

      {visit && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: desktopUp
              ? 'minmax(0, 320px) minmax(0, 1fr)'
              : 'minmax(0, 1fr)',
            gap: '16px',
            alignItems: 'start',
          }}
        >
          <VisitList
            visits={visits}
            selectedVisit={visit}
            days={days}
            selectedDay={day.day}
            onSelectVisit={handleSelectVisit}
            onSelectDay={handleSelectDay}
            onEditVisit={handleEditVisit}
          />

          <DayAgenda visit={visit} day={day} />
        </Box>
      )}
    </Box>
  );
};

export default CircuitOverseerVisit;
