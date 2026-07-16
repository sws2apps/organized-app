import { Box } from '@mui/material';
import { type KeyboardEvent } from 'react';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import Typography from '@components/typography';
import GroupBadge from '@components/group_badge';
import { MonthBadge, MonthDayCell, MonthViewProps } from './index.types';
import useMonthView from './useMonthView';

const DESKTOP_MAX_BADGES = 2;
const LINE = '1px solid var(--accent-200)';

const handleDayCellKeyDown = (
  e: KeyboardEvent<HTMLDivElement>,
  onSelectDay: (date: Date) => void,
  date: Date
) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    onSelectDay(date);
  }
};

type MeetingBadgesProps = {
  dateStr: string;
  visible: MonthBadge[];
  hidden: number;
  count: number;
};

const MeetingBadges = ({
  dateStr,
  visible,
  hidden,
  count,
}: MeetingBadgesProps) => {
  const { t } = useAppTranslation();
  const { tabletUp } = useBreakpoints();

  return (
    <Box
      sx={{
        marginTop: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        width: '100%',
        minWidth: 0,
      }}
    >
      {tabletUp ? (
        <>
          {visible.map((badge, index) => (
            <GroupBadge
              key={`${dateStr}-${index}`}
              label={badge.label}
              color={badge.color}
              variant="outlined"
              size="small"
              fullWidth
              align="center"
            />
          ))}
          {hidden > 0 && (
            <Typography
              className="label-small-regular"
              color="var(--accent-main)"
            >
              {t('tr_xMore', { quantity: hidden })}
            </Typography>
          )}
        </>
      ) : (
        <Box
          sx={{
            alignSelf: 'center',
            minWidth: '20px',
            padding: '0 6px',
            borderRadius: 'var(--radius-s)',
            border: '1px solid var(--accent-main)',
          }}
        >
          <Typography
            className="label-small-medium"
            color="var(--accent-main)"
            sx={{ textAlign: 'center' }}
          >
            {count}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

type DayCellProps = {
  cell: MonthDayCell;
  borderSx: Record<string, string>;
  onSelectDay: (date: Date) => void;
};

const DayCell = ({ cell, borderSx, onSelectDay }: DayCellProps) => {
  const { t } = useAppTranslation();
  const { tabletUp } = useBreakpoints();

  const hasMeetings = cell.badges.length > 0;
  const dotSize = tabletUp ? '12px' : '8px';

  const interactiveProps = hasMeetings
    ? {
        role: 'button',
        tabIndex: 0,
        onClick: () => onSelectDay(cell.date),
        onKeyDown: (e: KeyboardEvent<HTMLDivElement>) =>
          handleDayCellKeyDown(e, onSelectDay, cell.date),
        'aria-label': `${cell.dayNumber} – ${t('tr_meetings')}: ${cell.badges.length}`,
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
        backgroundColor: cell.isWeekend
          ? 'rgba(var(--accent-main-base), 0.04)'
          : 'var(--white)',
        ...(hasMeetings
          ? {
              cursor: 'pointer',
              '&:hover': { backgroundColor: 'var(--accent-100)' },
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
          {cell.dayNumber}
        </Typography>
        {cell.isToday && (
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

      {hasMeetings && (
        <MeetingBadges
          dateStr={cell.dateStr}
          visible={cell.badges.slice(0, DESKTOP_MAX_BADGES)}
          hidden={Math.max(0, cell.badges.length - DESKTOP_MAX_BADGES)}
          count={cell.badges.length}
        />
      )}
    </Box>
  );
};

const getCellBorderSx = (
  week: MonthDayCell[],
  weeks: MonthDayCell[][],
  dayIndex: number,
  weekIndex: number,
  inBlock: (cell: MonthDayCell | undefined, week: number) => boolean
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

/**
 * Monthly calendar grid. Each day cell shows a badge per group meeting
 * (with an "x more" overflow). On mobile it collapses to a compact grid with a
 * per-day count badge. Selecting a day opens that day in the week view.
 */
const MonthView = ({ meetings, onSelectDay }: MonthViewProps) => {
  const { tabletUp } = useBreakpoints();
  const { weeks, weekdayLabels } = useMonthView(meetings);

  // A cell belongs to the rendered calendar "block" when it is an in-month day
  // or a *leading* blank (any blank in the first week, i.e. before the 1st).
  // Trailing blanks (after the last day) are excluded so the grid steps away at
  // the end while still showing dividers at the beginning.
  const inBlock = (cell: MonthDayCell | undefined, week: number) =>
    cell !== undefined && (cell.inMonth || week === 0);

  return (
    <Box sx={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          backgroundColor: 'var(--white)',
          border: '1px solid var(--accent-200)',
        }}
      >
        {weekdayLabels.map((label) => (
          <Box key={label} sx={{ padding: tabletUp ? '12px' : '8px 4px' }}>
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
          {week.map((cell, dayIndex) => {
            // Trailing blanks render empty — grid outline steps away at the end.
            if (!inBlock(cell, weekIndex)) {
              return <Box key={cell.dateStr} />;
            }

            const borderSx = getCellBorderSx(
              week,
              weeks,
              dayIndex,
              weekIndex,
              inBlock
            );

            // Leading blanks (before the 1st): keep dividers, muted fill.
            if (!cell.inMonth) {
              return (
                <Box
                  key={cell.dateStr}
                  sx={{
                    minHeight: tabletUp ? '128px' : '64px',
                    ...borderSx,
                    backgroundColor: 'var(--accent-100)',
                  }}
                />
              );
            }

            return (
              <DayCell
                key={cell.dateStr}
                cell={cell}
                borderSx={borderSx}
                onSelectDay={onSelectDay}
              />
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

export default MonthView;
