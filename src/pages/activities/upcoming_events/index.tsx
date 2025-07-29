import { Box } from '@mui/material';
import { IconAdd } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useUpcomingEvents from './useUpcomingEvents';
import Button from '@components/button';
import EditUpcomingEvent from '@features/activities/upcoming_events/edit_upcoming_event';
import PageTitle from '@components/page_title';
import UpcomingEventsList from '@features/activities/upcoming_events/upcoming_events_list';
import ExportUpcomingEvents from '@features/activities/upcoming_events/export_upcoming_events';

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
              <Button
                variant="main"
                startIcon={<IconAdd />}
                onClick={handleAddEventButtonClick}
              >
                {t('tr_add')}
              </Button>
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
