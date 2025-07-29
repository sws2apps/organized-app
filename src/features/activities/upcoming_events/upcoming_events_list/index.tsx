import { Box, Typography } from '@mui/material';
import { IconInfo } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { UpcomingEventsListProps } from './index.types';
import useUpcomingEventsList from './useUpcomingEventsList';
import InfoTip from '@components/info_tip';
import UpcomingEvent from '../upcoming_event';

const UpcomingEventsList = (props: UpcomingEventsListProps) => {
  const { t } = useAppTranslation();

  const { eventsSortedByYear, stickyYearRefs, stuckYearIndexes, offsetLeft } =
    useUpcomingEventsList(props);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {!props.isAdding && eventsSortedByYear.length === 0 && (
        <InfoTip
          isBig={false}
          icon={<IconInfo />}
          color="white"
          text={t('tr_upcomingEventsEmpty')}
        />
      )}

      {eventsSortedByYear.length > 0 &&
        eventsSortedByYear.map((upcomingEventsYear, yearIndex) => {
          const firstStart = upcomingEventsYear[0]?.event_data.start;

          if (!firstStart) return null;

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
                ref={(element: HTMLDivElement) => {
                  stickyYearRefs.current[yearIndex] = element;
                }}
                sx={{
                  padding: isStuck
                    ? {
                        mobile: `16px 16px 60px ${offsetLeft}px`,
                        tablet: `16px 24px 60px ${offsetLeft}px`,
                        desktop: `16px 32px 60px ${offsetLeft}px`,
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
