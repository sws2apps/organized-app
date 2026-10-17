import { Box } from '@mui/material';
import { IconAdd } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useUpcomingEvents from './useUpcomingEvents';
import EditUpcomingEvent from '@features/activities/upcoming_events/edit_upcoming_event';
import PageTitle from '@components/page_title';
import QuickSettingsUpcomingEvents from '@features/activities/upcoming_events/quick_settings';
import UpcomingEventsList from '@features/activities/upcoming_events/upcoming_events_list';
import ExportUpcomingEvents from '@features/activities/upcoming_events/export_upcoming_events';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';

const UpcomingEvents = () => {
  const { t } = useAppTranslation();
  const { tablet688Up } = useBreakpoints();

  const {
    isAdmin,
    emptyEvent,
    events,
    handleAddEventButtonClick,
    handleHideAddEventBox,
    addEventBoxShow,
    handleSaveEvent,
    quickSettingsOpen,
    handleOpenQuickSettings,
    handleCloseQuickSettings,
  } = useUpcomingEvents();

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
        <QuickSettingsUpcomingEvents
          open={quickSettingsOpen}
          onClose={handleCloseQuickSettings}
        />
      )}

      <PageTitle
        title={t('tr_upcomingEvents')}
        quickSettings={isAdmin ? handleOpenQuickSettings : undefined}
        buttons={
          isAdmin && (
            <NavBarButtonGroup>
              <ExportUpcomingEvents />
              <NavBarButton
                text={t('tr_add')}
                icon={<IconAdd />}
                onClick={handleAddEventButtonClick}
              ></NavBarButton>
            </NavBarButtonGroup>
          )
        }
      />

      {addEventBoxShow && (
        <EditUpcomingEvent
          data={emptyEvent}
          type="add"
          onSave={handleSaveEvent}
          onCancel={handleHideAddEventBox}
        />
      )}

      <UpcomingEventsList data={events} isAdding={addEventBoxShow} />
    </Box>
  );
};

export default UpcomingEvents;
