import { useId } from 'react';
import { Box } from '@mui/material';
import Card from '@components/card';
import Typography from '@components/typography';
import { DayAgendaProps } from '@components/day_agenda/index.types';
import { useBreakpoints } from '@hooks/index';

/** A shared date header and time rail for a day's scheduled activities. */
const DayAgenda = ({ title, subtitle, slots }: DayAgendaProps) => {
  const headingId = useId();
  const { tabletUp } = useBreakpoints();

  return (
    <Box
      component="section"
      aria-labelledby={headingId}
      className="day-agenda"
      sx={{ minWidth: 0 }}
    >
      <Card
        sx={{
          padding: 0,
          gap: 0,
          minWidth: 0,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: tabletUp
            ? 'max-content minmax(0, 1fr)'
            : 'minmax(0, 1fr)',
        }}
      >
        <Box
          className="day-agenda-header"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px 16px',
            padding: '8px 12px',
            gridColumn: '1 / -1',
            backgroundColor: 'var(--accent-200)',
          }}
        >
          <Box sx={{ minWidth: 0, flex: '1 1 auto' }}>
            <Typography
              component="h3"
              id={headingId}
              className="h4"
              color="var(--accent-dark)"
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
        </Box>
        {slots.map((slot) => (
          <Box
            component="section"
            key={slot.key}
            aria-label={slot.time}
            className="day-agenda-slot"
            sx={{
              display: 'grid',
              gridColumn: '1 / -1',
              gridTemplateColumns: 'subgrid',
              gap: 0,
              minWidth: 0,
              '& + &': { borderTop: '1px solid var(--accent-200)' },
            }}
          >
            <Box
              className="day-agenda-time"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '4px',
                backgroundColor:
                  'color-mix(in srgb, var(--accent-150) 50%, var(--white))',
                padding: tabletUp ? '12px' : '8px 12px',
                minWidth: 0,
              }}
            >
              <Box component="time" dateTime={slot.dateTime}>
                <Typography
                  className="h4"
                  color="var(--accent-dark)"
                  sx={{
                    fontVariantNumeric: 'tabular-nums',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {slot.time}
                </Typography>
              </Box>
            </Box>
            <Box
              className="day-agenda-content"
              sx={{
                minWidth: 0,
                borderInlineStart: tabletUp
                  ? '1px solid var(--accent-200)'
                  : undefined,
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
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
