import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { UpcomingEventsListProps } from './index.types';
import useUpcomingEventsList from './useUpcomingEventsList';
import InfoNote from '@components/info_note';
import Typography from '@components/typography';
import UpcomingEvent from '../upcoming_event';

const UpcomingEventsList = (props: UpcomingEventsListProps) => {
  const { t } = useAppTranslation();

  const { eventsSortedByYear } = useUpcomingEventsList(props);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {!props.isAdding && eventsSortedByYear.length === 0 && (
        <InfoNote message={t('tr_upcomingEventsEmpty')} variant="card" />
      )}

      {eventsSortedByYear.map((upcomingEventsYear) => {
        const firstStart = upcomingEventsYear[0]?.event_data.start;

        if (!firstStart) return null;

        const year = new Date(firstStart).getFullYear();

        return (
          <Box
            key={year}
            sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <Box
              sx={{
                position: 'sticky',
                top: '62px',
                zIndex: 2,
                padding: '8px 0',
                backgroundColor: 'var(--accent-100)',
                // the list keeps scrolling under the year, never behind a hard edge
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  insetInline: 0,
                  top: '100%',
                  height: '16px',
                  background:
                    'linear-gradient(180deg, var(--accent-100) 0%, rgba(var(--accent-100-base), 0) 100%)',
                },
              }}
            >
              <Typography className="h4" color="var(--accent-400)">
                {year}
              </Typography>
            </Box>

            {upcomingEventsYear.map((upcomingEvent) => (
              <UpcomingEvent
                data={upcomingEvent}
                key={upcomingEvent.event_uid}
              />
            ))}
          </Box>
        );
      })}
    </Box>
  );
};

export default UpcomingEventsList;
