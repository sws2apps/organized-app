import { Box } from '@mui/material';
import { YearlyUpcomingEventsProps } from './index.types';
import Typography from '@components/typography';
import DateWithUpcomingEvents from '../date_with_upcoming_events';
import useYearlyUpcomingEvents from './useYearlyUpcomingEvents';

const YearlyUpcomingEvents = (props: YearlyUpcomingEventsProps) => {
  const { eventsSortedByDate, year } = useYearlyUpcomingEvents(props);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Typography
        className="h4"
        color="var(--accent-400)"
        sx={{ paddingTop: '16px' }}
      >
        {year}
      </Typography>
      {eventsSortedByDate.map((dateWithUpcomingEvents) => (
        <DateWithUpcomingEvents
          data={dateWithUpcomingEvents}
          key={new Date(
            dateWithUpcomingEvents[0].event_date.date
          ).toISOString()}
        />
      ))}
    </Box>
  );
};

export default YearlyUpcomingEvents;
