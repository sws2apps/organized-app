import { Box, Typography } from '@mui/material';
import { UpcomingEventsListProps } from './index.types';
import InfoTip from '@components/info_tip';
import { IconInfo } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useUpcomingEventsList from './useUpcomingEventsList';
import UpcomingEvent from '../upcoming_event';

const UpcomingEventsList = (props: UpcomingEventsListProps) => {
  const { t } = useAppTranslation();
  const {
    eventsSortedByYear,
    stickyYearRefs,
    stuckYearIndexes,
    isEventExpired,
    isAdmin,
  } = useUpcomingEventsList(props);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {!eventsSortedByYear.length || !eventsSortedByYear[0]?.length ? (
        <InfoTip
          isBig={false}
          icon={<IconInfo />}
          color="white"
          text={t('tr_upcomingEventsEmpty')}
        />
      ) : (
        eventsSortedByYear.map((upcomingEventsYear, yearIndex) => {
          const firstStart =
            upcomingEventsYear[0]?.event_data?.event_dates?.[0]?.start;

          if (!firstStart) {
            return null;
          }

          const year = new Date(firstStart).getFullYear();

          const isStuck = stuckYearIndexes.has(yearIndex);

          return (
            <Box
              key={year}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {isStuck && <Box sx={{ height: '36px' }} />}
              <Box
                ref={(element) => (stickyYearRefs.current[yearIndex] = element)}
                sx={{
                  padding: isStuck
                    ? {
                        mobile: '16px 16px 60px 16px',
                        tablet: '16px 24px 60px 24px',
                        desktop: '16px 32px 60px 32px',
                      }
                    : '16px 0px 0px 0px',
                  position: isStuck ? 'fixed' : 'relative',
                  top: isStuck ? '50px' : 'auto',
                  height: isStuck ? '80px' : 'auto',
                  zIndex: 2,
                  background: isStuck
                    ? 'linear-gradient(180deg, var(--accent-100) 31%, rgba(248, 249, 255, 0%) 100%)'
                    : 'transparent',
                  width: isStuck ? '100%' : 'auto',
                  left: isStuck ? '0' : 'auto',
                  transition: 'transform 0.5s ease',
                  transform: isStuck ? 'translateY(6px)' : 'translateY(0px)',
                }}
              >
                <Typography className="h4" color="var(--accent-400)">
                  {year}
                </Typography>
              </Box>

              {upcomingEventsYear.map((upcomingEvent) =>
                !upcomingEvent._deleted ||
                isEventExpired(upcomingEvent, isAdmin) ? (
                  <UpcomingEvent
                    data={upcomingEvent}
                    key={upcomingEvent.event_uid}
                  />
                ) : (
                  <Box key={upcomingEvent.event_uid} />
                )
              )}
            </Box>
          );
        })
      )}
    </Box>
  );
};

export default UpcomingEventsList;
