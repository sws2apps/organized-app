import { IconAdd, IconPrint } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import PageTitle from '@components/page_title';
import { Box } from '@mui/material';
import UpcomingEventsList from '@features/congregation/upcoming_events/upcoming_events_list';
import useUpcomingEvents from './useUpcomingEvents';

const UpcomingEvents = () => {
  const { t } = useAppTranslation();
  const { isAdmin, upcomingEvents, handleAddEventButtonClick } =
    useUpcomingEvents();

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
              <Button variant="secondary" startIcon={<IconPrint />}>
                {t('tr_export')}
              </Button>
              <Button
                variant="main"
                startIcon={<IconAdd />}
                onClick={handleAddEventButtonClick}
              >
                {t('tr_addEvent')}
              </Button>
            </>
          )
        }
      />
      <UpcomingEventsList data={upcomingEvents} />
      {/* {addEventBoxShow && <EditUpcomingEvent />} */}
    </Box>
  );
};

export default UpcomingEvents;
