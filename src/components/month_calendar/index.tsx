import { type KeyboardEvent, type ReactNode } from 'react';
import { Box } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import Typography from '@components/typography';
import { MonthCalendarDay, MonthCalendarProps } from './index.types';

const LINE = '1px solid var(--accent-200)';

const getCellBorderSx = (
  week: MonthCalendarDay[],
  weeks: MonthCalendarDay[][],
  dayIndex: number,
  weekIndex: number,
  inBlock: (cell: MonthCalendarDay | undefined, week: number) => boolean
): Record<string, string> => {
  const leftInBlock = inBlock(week[dayIndex - 1], weekIndex);
  const topInBlock = inBlock(weeks[weekIndex - 1]?.[dayIndex], weekIndex - 1);

  return {
    borderRight: LINE,
    borderBottom: LINE,
    ...(leftInBlock ? {} : { borderLeft: LINE }),
    ...(weekIndex > 0 && !topInBlock ? { borderTop: LINE } : {}),
  };
};

type DayCellProps = {
  day: MonthCalendarDay;
  borderSx: Record<string, string>;
  selectable: boolean;
  highlightWeekends: boolean;
  ariaLabel?: string;
  onSelect?: () => void;
  children?: ReactNode;
};

const DayCell = ({
  day,
  borderSx,
  selectable,
  highlightWeekends,
  ariaLabel,
  onSelect,
  children,
}: DayCellProps) => {
  const { tabletUp } = useBreakpoints();

  const dotSize = tabletUp ? '12px' : '8px';

  const interactiveProps = selectable
    ? {
        role: 'button',
        tabIndex: 0,
        'aria-label': ariaLabel,
        onClick: onSelect,
        onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          onSelect?.();
        },
      }
    : {};

  return (
    <Box
      {...interactiveProps}
      sx={{
        minHeight: tabletUp ? '128px' : '64px',
        padding: tabletUp ? '8px' : '4px',
        alignItems: tabletUp ? 'stretch' : 'center',
        ...borderSx,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        backgroundColor:
          highlightWeekends && day.isWeekend
            ? 'rgba(var(--accent-main-base), 0.04)'
            : 'var(--white)',
        ...(selectable
          ? {
              cursor: 'pointer',
              '&:hover': { backgroundColor: 'var(--accent-100)' },
              '&:focus-visible': { outline: 'var(--accent-main) auto 1px' },
            }
          : { cursor: 'default' }),
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Typography className="body-small-semibold" color="var(--black)">
          {day.dayNumber}
        </Typography>
        {day.isToday && (
          <Box
            aria-hidden
            sx={{
              width: dotSize,
              height: dotSize,
              borderRadius: '50%',
              backgroundColor: 'var(--accent-main)',
              flexShrink: 0,
            }}
          />
        )}
      </Box>

      {children}
    </Box>
  );
};

/**
 * Monthly calendar grid: a weekday header row and one bordered cell per day,
 * with the outline stepping away after the last day of the month. What a day
 * shows below its number is up to the caller (`renderDay`).
 */
const MonthCalendar = ({
  weeks,
  weekdayLabels,
  renderDay,
  isDaySelectable,
  onSelectDay,
  dayAriaLabel,
  highlightWeekends = false,
}: MonthCalendarProps) => {
  const { tabletUp } = useBreakpoints();

  // A cell belongs to the rendered calendar "block" when it is an in-month day
  // or a *leading* blank (any blank in the first week, i.e. before the 1st).
  // Trailing blanks (after the last day) are excluded so the grid steps away at
  // the end while still showing dividers at the beginning.
  const inBlock = (cell: MonthCalendarDay | undefined, week: number) =>
    cell !== undefined && (cell.inMonth || week === 0);

  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          backgroundColor: 'var(--white)',
        }}
      >
        {weekdayLabels.map((label, index) => (
          <Box
            key={label}
            sx={{
              padding: tabletUp ? '12px' : '8px 4px',
              borderTop: LINE,
              borderRight: LINE,
              borderBottom: LINE,
              ...(index === 0 && {
                borderLeft: LINE,
                borderTopLeftRadius: 'var(--radius-l)',
              }),
              ...(index === weekdayLabels.length - 1 && {
                borderTopRightRadius: 'var(--radius-l)',
              }),
            }}
          >
            <Typography
              className="body-small-semibold"
              color="var(--grey-400)"
              sx={{ textAlign: tabletUp ? 'left' : 'center' }}
            >
              {tabletUp ? label : label.charAt(0)}
            </Typography>
          </Box>
        ))}
      </Box>

      {weeks.map((week, weekIndex) => (
        <Box
          key={week[0].dateStr}
          sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}
        >
          {week.map((day, dayIndex) => {
            // Trailing blanks render empty — grid outline steps away at the end.
            if (!inBlock(day, weekIndex)) {
              return <Box key={day.dateStr} />;
            }

            const isLastWeek = weekIndex === weeks.length - 1;

            const borderSx = {
              ...getCellBorderSx(week, weeks, dayIndex, weekIndex, inBlock),
              ...(isLastWeek &&
                dayIndex === 0 && {
                  borderBottomLeftRadius: 'var(--radius-l)',
                }),
              ...(isLastWeek &&
                dayIndex === week.length - 1 &&
                inBlock(day, weekIndex) && {
                  borderBottomRightRadius: 'var(--radius-l)',
                }),
            };

            // Leading blanks (before the 1st): keep dividers, muted fill.
            if (!day.inMonth) {
              return (
                <Box
                  key={day.dateStr}
                  sx={{
                    minHeight: tabletUp ? '128px' : '64px',
                    ...borderSx,
                    backgroundColor: 'var(--accent-100)',
                  }}
                />
              );
            }

            const selectable = isDaySelectable?.(day) ?? true;

            return (
              <DayCell
                key={day.dateStr}
                day={day}
                borderSx={borderSx}
                selectable={selectable}
                highlightWeekends={highlightWeekends}
                ariaLabel={dayAriaLabel?.(day)}
                onSelect={() => onSelectDay?.(day)}
              >
                {renderDay?.(day)}
              </DayCell>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

export default MonthCalendar;
