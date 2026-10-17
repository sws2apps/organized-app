import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';
import { AssignmentsListProps } from './index.types';
import useMonthPin, { PIN_HEIGHT } from './useMonthPin';
import MonthHeader from '../month_header';
import WeekCard from '../week_card';

const enterFromBelow = keyframes`
  from { transform: translateY(60%); opacity: 0; }
  to { transform: none; opacity: 1; }
`;

const enterFromAbove = keyframes`
  from { transform: translateY(-60%); opacity: 0; }
  to { transform: none; opacity: 1; }
`;

const leaveUp = keyframes`
  to { transform: translateY(-60%); opacity: 0; }
`;

const leaveDown = keyframes`
  to { transform: translateY(60%); opacity: 0; }
`;

const EASING = '280ms cubic-bezier(0.2, 0.8, 0.2, 1) both';

const headerSx = {
  height: `${PIN_HEIGHT}px`,
  // month text lines up with the drawer title and the card content
  padding: '12px 8px 8px',
};

// the pin reaches 8px further right than the list content
const pinnedHeaderSx = { ...headerSx, paddingRight: '16px' };

const AssignmentsList = ({
  months,
  resetKey,
  onOpen,
}: AssignmentsListProps) => {
  const { ref, pin } = useMonthPin(resetKey, months);

  const down = pin.direction === 'down';

  const enterAnimation = `${down ? enterFromBelow : enterFromAbove} ${EASING}`;

  return (
    <Box sx={{ position: 'relative', flex: 1, minHeight: 0 }}>
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          // spans the list's full width, which reaches into the drawer padding
          right: '-8px',
          height: `${PIN_HEIGHT}px`,
          overflow: 'hidden',
          zIndex: 1,
          pointerEvents: 'none',
          backgroundColor: 'var(--accent-100)',
          '& > *': {
            position: 'absolute',
            inset: 0,
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          },
        }}
      >
        {pin.previous !== -1 && months[pin.previous] && (
          <MonthHeader
            key={`leave-${pin.previous}`}
            month={months[pin.previous]}
            sx={{
              ...pinnedHeaderSx,
              animation: `${down ? leaveUp : leaveDown} ${EASING}`,
            }}
          />
        )}

        {months[pin.index] && (
          <MonthHeader
            key={`pin-${pin.index}`}
            month={months[pin.index]}
            sx={{
              ...pinnedHeaderSx,
              animation: pin.previous === -1 ? 'none' : enterAnimation,
            }}
          />
        )}
      </Box>

      <Box
        ref={ref}
        className="scroll-fade-y"
        sx={{
          '--scroll-fade-inset': `${PIN_HEIGHT}px`,
          position: 'relative',
          height: '100%',
          overflowY: 'auto',
          // cards keep the same 16px edge on both sides; the scrollbar sits in
          // the drawer padding instead of eating into the right side
          padding: '0 4px 16px 0',
          marginRight: '-8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          '& > *': { flexShrink: 0 },
          '&::-webkit-scrollbar': { width: '4px' },
          // the track starts under the pinned month, never beside it
          '&::-webkit-scrollbar-track': { marginTop: `${PIN_HEIGHT}px` },
        }}
      >
        {months.map((month) => (
          <Box
            key={month.month}
            sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <MonthHeader month={month} data-month-header sx={headerSx} />

            {month.weeks.map((week) => (
              <WeekCard key={week.weekOf} week={week} onOpen={onOpen} />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AssignmentsList;
