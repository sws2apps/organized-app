import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { UpcomingEventsListProps } from './index.types';
import useUpcomingEventsList from './useUpcomingEventsList';
import InfoNote from '@components/info_note';
import Typography from '@components/typography';
import UpcomingEvent from '../upcoming_event';

// starts fading right under the year and trails off far below it, so the list
// slides out of view instead of passing behind a band
const YEAR_SCRIM = `linear-gradient(
  180deg,
  rgba(var(--accent-100-base), 1) 0%,
  rgba(var(--accent-100-base), 0.96) 14%,
  rgba(var(--accent-100-base), 0.85) 26%,
  rgba(var(--accent-100-base), 0.68) 38%,
  rgba(var(--accent-100-base), 0.5) 50%,
  rgba(var(--accent-100-base), 0.34) 61%,
  rgba(var(--accent-100-base), 0.21) 71%,
  rgba(var(--accent-100-base), 0.11) 80%,
  rgba(var(--accent-100-base), 0.05) 88%,
  rgba(var(--accent-100-base), 0.015) 95%,
  rgba(var(--accent-100-base), 0) 100%
)`;

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
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  insetInline: 0,
                  top: 0,
                  bottom: '-64px',
                  zIndex: -1,
                  background: YEAR_SCRIM,
                  pointerEvents: 'none',
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
