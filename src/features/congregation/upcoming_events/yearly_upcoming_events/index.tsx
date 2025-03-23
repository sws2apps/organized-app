import { Box } from '@mui/material';
import { YearlyUpcomingEventsProps } from './index.types';
import Typography from '@components/typography';
import DateWithUpcomingEvents from '../date_with_upcoming_events';
import useYearlyUpcomingEvents from './useYearlyUpcomingEvents';

const YearlyUpcomingEvents = (props: YearlyUpcomingEventsProps) => {
  const { year, eventsSortedByDate } = useYearlyUpcomingEvents(props);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Typography
        className="h4"
        color="var(--accent-400)"
        sx={{ paddingTop: '16px' }}
      >
        {year}
      </Typography>
      {eventsSortedByDate.map((dateWithUpcomingEvents, index) => (
        <DateWithUpcomingEvents data={dateWithUpcomingEvents} key={index} />
      ))}
    </Box>
  );
};

export default YearlyUpcomingEvents;
