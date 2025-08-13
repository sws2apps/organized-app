import { Box } from '@mui/material';
import { IconAdd } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useUpcomingEvents from './useUpcomingEvents';
import EditUpcomingEvent from '@features/activities/upcoming_events/edit_upcoming_event';
import PageTitle from '@components/page_title';
import UpcomingEventsList from '@features/activities/upcoming_events/upcoming_events_list';
import ExportUpcomingEvents from '@features/activities/upcoming_events/export_upcoming_events';
import NavBarButton from '@components/nav_bar_button';

const UpcomingEvents = () => {
  const { t } = useAppTranslation();

  const {
    isAdmin,
    emptyEvent,
    events,
    handleAddEventButtonClick,
    handleHideAddEventBox,
    addEventBoxShow,
    handleSaveEvent,
  } = useUpcomingEvents();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
      }}
    >
      <PageTitle
        title={t('tr_upcomingEvents')}
        buttons={
          isAdmin && (
            <>
              <ExportUpcomingEvents />
              <NavBarButton
                main
                text={t('tr_add')}
                icon={<IconAdd />}
                onClick={handleAddEventButtonClick}
              ></NavBarButton>
            </>
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
