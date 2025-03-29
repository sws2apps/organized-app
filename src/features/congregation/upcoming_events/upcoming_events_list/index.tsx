import { Box } from '@mui/material';
import { UpcomingEventsListProps } from './index.types';
import InfoTip from '@components/info_tip';
import { IconInfo } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import YearlyUpcomingEvents from '../yearly_upcoming_events';
import useUpcomingEventsList from './useUpcomingEventsList';

const UpcomingEventsList = (props: UpcomingEventsListProps) => {
  const { t } = useAppTranslation();
  const { eventsSortedByYear } = useUpcomingEventsList(props);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {eventsSortedByYear[0].length == 0 ? (
        <InfoTip
          isBig={false}
          icon={<IconInfo />}
          color="white"
          text={t('tr_upcomingEventsEmpty')}
        />
      ) : (
        eventsSortedByYear.map((upcomingEventsYear) => (
          <YearlyUpcomingEvents
            data={upcomingEventsYear}
            key={new Date(upcomingEventsYear[0].event_date.date).getFullYear()}
          />
        ))
      )}
    </Box>
  );
};

export default UpcomingEventsList;
