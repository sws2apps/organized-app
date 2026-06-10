import { Box } from '@mui/material';
import { type KeyboardEvent } from 'react';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import Typography from '@components/typography';
import GroupBadge from '@components/group_badge';
import { FieldServiceMeetingFormattedType } from '@definition/field_service_meetings';
import useMonthView, { MonthDayCell, MonthBadge } from './useMonthView';

type MonthViewProps = {
  meetings: FieldServiceMeetingFormattedType[];
  onSelectDay: (date: Date) => void;
};

const DESKTOP_MAX_BADGES = 2;
const LINE = '1px solid var(--accent-200)';

// ─── Keyboard handler (module-level — no nesting penalty) ────────────────────

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

// ─── Meeting badges ───────────────────────────────────────────────────────────

type MeetingBadgesProps = {
  dateStr: string;
  visible: MonthBadge[];
  hidden: number;
  count: number;
  tabletUp: boolean;
  t: (key: string, opts?: Record<string, unknown>) => string;
};

const MeetingBadges = ({
  dateStr,
  visible,
  hidden,
  count,
  tabletUp,
  t,
}: MeetingBadgesProps) => (
  <Box
    sx={{
      marginTop: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
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
          <Box
            sx={{
              width: '100%',
              padding: '2px 4px',
              borderRadius: 'var(--radius-s)',
              border: '1px solid var(--grey-350)',
              backgroundColor: 'var(--grey-100)',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Typography
              className="label-small-regular"
              color="var(--grey-350)"
              sx={{ textAlign: 'center' }}
            >
              {t('tr_xMore', { quantity: hidden })}
            </Typography>
          </Box>
        )}
      </>
    ) : (
      <Box
        sx={{
          width: '100%',
          padding: '2px 4px',
          borderRadius: 'var(--radius-s)',
          border: '1px solid var(--accent-main)',
          display: 'flex',
          justifyContent: 'center',
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

// ─── Day cell config (module-level helper — keeps all branching out of DayCell) ──

type DayCellInteractiveProps = {
  role?: 'button';
  tabIndex?: number;
  onClick?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
  'aria-label'?: string;
};

type DayCellConfig = {
  interactiveProps: DayCellInteractiveProps;
  cellSx: Record<string, unknown>;
};

const getDayCellConfig = (
  cell: MonthDayCell,
  borderSx: Record<string, string>,
  tabletUp: boolean,
  onSelectDay: (date: Date) => void
): DayCellConfig => {
  const hasMeetings = cell.badges.length > 0;
  const layout = tabletUp
    ? { minHeight: '128px', padding: '8px', alignItems: 'stretch' as const }
    : { minHeight: '64px', padding: '4px', alignItems: 'flex-start' as const };
  const weekendBg = cell.isWeekend ? 'rgba(var(--accent-main-base), 0.04)' : 'var(--white)';
  const interactiveSx = hasMeetings
    ? { cursor: 'pointer', '&:hover': { backgroundColor: 'var(--accent-100)' } }
    : { cursor: 'not-allowed' };
  const cellSx = {
    ...layout,
    ...borderSx,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    backgroundColor: weekendBg,
    overflow: 'hidden' as const,
    minWidth: 0,
    ...interactiveSx,
  };

  if (!hasMeetings) {
    return { interactiveProps: {}, cellSx };
  }

  const meetingSuffix = cell.badges.length === 1 ? '' : 's';
  return {
    interactiveProps: {
      role: 'button' as const,
      tabIndex: 0,
      onClick: () => onSelectDay(cell.date),
      onKeyDown: (e: KeyboardEvent<HTMLDivElement>) =>
        handleDayCellKeyDown(e, onSelectDay, cell.date),
      'aria-label': `${cell.dayNumber} – ${cell.badges.length} meeting${meetingSuffix}`,
    },
    cellSx,
  };
};

// ─── Day cell ─────────────────────────────────────────────────────────────────

type DayCellProps = {
  cell: MonthDayCell;
  borderSx: Record<string, string>;
  onSelectDay: (date: Date) => void;
  tabletUp: boolean;
  t: (key: string, opts?: Record<string, unknown>) => string;
};

const DayCell = ({ cell, borderSx, onSelectDay, tabletUp, t }: DayCellProps) => {
  const { interactiveProps, cellSx } = getDayCellConfig(
    cell,
    borderSx,
    tabletUp,
    onSelectDay
  );
  const hasMeetings = cell.badges.length > 0;
  const circleSize = tabletUp ? '28px' : '22px';

  return (
    <Box {...interactiveProps} sx={cellSx}>
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Box
          sx={{
            width: circleSize,
            height: circleSize,
            borderRadius: '50%',
            backgroundColor: cell.isToday ? 'var(--accent-main)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Typography
            className="body-small-semibold"
            color={cell.isToday ? 'var(--always-white)' : 'var(--black)'}
          >
            {cell.dayNumber}
          </Typography>
        </Box>
      </Box>

      {hasMeetings && (
        <MeetingBadges
          dateStr={cell.dateStr}
          visible={cell.badges.slice(0, DESKTOP_MAX_BADGES)}
          hidden={Math.max(0, cell.badges.length - DESKTOP_MAX_BADGES)}
          count={cell.badges.length}
          tabletUp={tabletUp}
          t={t}
        />
      )}
    </Box>
  );
};

// ─── Border helper ────────────────────────────────────────────────────────────

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

// ─── Month grid ───────────────────────────────────────────────────────────────

/**
 * Monthly calendar grid. Each day cell shows a badge per group meeting
 * (with an "x more" overflow). On mobile it collapses to a compact grid with a
 * per-day count badge. Selecting a day opens that day in the week view.
 */
const MonthView = ({ meetings, onSelectDay }: MonthViewProps) => {
  const { t } = useAppTranslation();
  const { tabletUp } = useBreakpoints();
  const { weeks, weekdayLabels } = useMonthView(meetings);

  // A cell belongs to the rendered calendar "block" when it is an in-month day
  // or a *leading* blank (any blank in the first week, i.e. before the 1st).
  // Trailing blanks (after the last day) are excluded so the grid steps away at
  // the end while still showing dividers at the beginning.
  const inBlock = (cell: MonthDayCell | undefined, week: number) =>
    cell !== undefined && (cell.inMonth || week === 0);

  return (
    <Box sx={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--accent-300)' }}>
      {/* Weekday header (always full width) */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          backgroundColor: 'var(--white)',
          borderBottom: '1px solid var(--accent-200)',
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

      {/* Day cells */}
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

            const borderSx = getCellBorderSx(week, weeks, dayIndex, weekIndex, inBlock);

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
                tabletUp={tabletUp}
                t={t}
              />
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

export default MonthView;
