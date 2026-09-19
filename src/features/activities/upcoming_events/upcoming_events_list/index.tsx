import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { UpcomingEventsListProps } from './index.types';
import useUpcomingEventsList from './useUpcomingEventsList';
import InfoNote from '@components/info_note';
import Typography from '@components/typography';
import UpcomingEvent from '../upcoming_event';

// eased, so the list fades out evenly instead of behind a dark band
const YEAR_SCRIM = `linear-gradient(
  180deg,
  rgba(var(--accent-100-base), 1) 0%,
  rgba(var(--accent-100-base), 0.98) 10%,
  rgba(var(--accent-100-base), 0.92) 20%,
  rgba(var(--accent-100-base), 0.82) 30%,
  rgba(var(--accent-100-base), 0.68) 40%,
  rgba(var(--accent-100-base), 0.5) 50%,
  rgba(var(--accent-100-base), 0.32) 60%,
  rgba(var(--accent-100-base), 0.18) 70%,
  rgba(var(--accent-100-base), 0.08) 80%,
  rgba(var(--accent-100-base), 0.02) 90%,
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
                backgroundColor: 'var(--accent-100)',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  insetInline: 0,
                  top: '100%',
                  height: '24px',
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
