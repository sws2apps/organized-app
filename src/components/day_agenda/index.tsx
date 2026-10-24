import { useId } from 'react';
import { Box } from '@mui/material';
import Card from '@components/card';
import Typography from '@components/typography';
import { DayAgendaProps } from '@components/day_agenda/index.types';
import { useBreakpoints } from '@hooks/index';

/** A shared date header and time rail for a day's scheduled activities. */
const DayAgenda = ({ title, subtitle, countLabel, slots }: DayAgendaProps) => {
  const headingId = useId();
  const { tabletUp, mobile400Down } = useBreakpoints();

  return (
    <Box
      component="section"
      aria-labelledby={headingId}
      className="day-agenda"
      sx={{ minWidth: 0 }}
    >
      <Card sx={{ padding: 0, gap: 0, minWidth: 0, overflow: 'hidden' }}>
        <Box
          className="day-agenda-header"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px 16px',
            padding: tabletUp ? '8px 24px' : '8px 16px',
            backgroundColor: 'var(--accent-150)',
          }}
        >
          <Box sx={{ minWidth: 0, flex: '1 1 auto' }}>
            <Typography
              component="h3"
              id={headingId}
              className="h4"
              sx={{ overflowWrap: 'anywhere' }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                className="body-small-regular"
                color="var(--grey-400)"
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          {countLabel && (
            <Typography
              className="body-small-regular"
              color="var(--accent-dark)"
              sx={{ overflowWrap: 'anywhere' }}
            >
              {countLabel}
            </Typography>
          )}
        </Box>
        {slots.map((slot) => (
          <Box
            component="section"
            key={slot.key}
            aria-label={slot.time}
            className="day-agenda-slot"
            sx={{
              display: 'grid',
              gridTemplateColumns: mobile400Down
                ? 'minmax(0, 1fr)'
                : tabletUp
                  ? '80px minmax(0, 1fr)'
                  : '56px minmax(0, 1fr)',
              gap: mobile400Down ? '12px' : 0,
              padding: tabletUp ? '20px 24px' : '16px',
              minWidth: 0,
              '& + &': { borderTop: '1px solid var(--accent-200)' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: mobile400Down ? 'row' : 'column',
                alignItems: mobile400Down ? 'center' : 'flex-start',
                justifyContent: mobile400Down ? 'space-between' : undefined,
                gap: '4px',
                minWidth: 0,
              }}
            >
              <Box component="time" dateTime={slot.dateTime}>
                <Typography
                  className="h4"
                  color="var(--accent-dark)"
                  sx={{
                    fontVariantNumeric: 'tabular-nums',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {slot.time}
                </Typography>
              </Box>
              {slot.countLabel && (
                <Typography
                  className="label-small-regular"
                  color="var(--grey-400)"
                >
                  {slot.countLabel}
                </Typography>
              )}
            </Box>
            <Box
              className="day-agenda-content"
              sx={{
                minWidth: 0,
                borderInlineStart: '1px solid var(--accent-200)',
                paddingInlineStart: tabletUp ? '20px' : '12px',
              }}
            >
              {slot.content}
            </Box>
          </Box>
        ))}
      </Card>
    </Box>
  );
};

export default DayAgenda;
