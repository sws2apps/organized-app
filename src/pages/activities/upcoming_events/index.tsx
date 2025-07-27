import { Box } from '@mui/material';
import { IconAdd } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useUpcomingEvents from './useUpcomingEvents';
import Button from '@components/button';
import EditUpcomingEvent from '@features/activities/upcoming_events/edit_upcoming_event';
import PageTitle from '@components/page_title';
import UpcomingEventsList from '@features/activities/upcoming_events/upcoming_events_list';

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
              {/*
              // TODO: Add on next PR for this page
               <Button variant="secondary" startIcon={<IconPrint />}>
                {t('tr_export')}
              </Button> */}
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

      <UpcomingEventsList data={events} />
    </Box>
  );
};

export default UpcomingEvents;
