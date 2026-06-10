import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import Typography from '@components/typography';
import GroupBadge from '@components/group_badge';
import { FieldServiceMeetingFormattedType } from '@definition/field_service_meetings';
import useMonthView from './useMonthView';

type MonthViewProps = {
  meetings: FieldServiceMeetingFormattedType[];
  onSelectDay: (date: Date) => void;
};

const DESKTOP_MAX_BADGES = 2;

/**
 * Monthly calendar grid. Each day cell shows a badge per group meeting
 * (with an "x more" overflow). On mobile it collapses to a compact grid with a
 * per-day count badge. Selecting a day opens that day in the week view.
 */
const MonthView = ({ meetings, onSelectDay }: MonthViewProps) => {
  const { t } = useAppTranslation();
  const { tabletUp } = useBreakpoints();
  const { weeks, weekdayLabels } = useMonthView(meetings);

  const LINE = '1px solid var(--accent-200)';

  // A cell belongs to the rendered calendar "block" when it is an in-month day
  // or a *leading* blank (any blank in the first week, i.e. before the 1st).
  // Trailing blanks (after the last day) are excluded so the grid steps away at
  // the end while still showing dividers at the beginning.
  const inBlock = (cell: (typeof weeks)[number][number] | undefined, week: number) =>
    Boolean(cell) && (cell!.inMonth || week === 0);

  return (
    <Box
      sx={{
        // No outer border/background here: the grid lines are drawn by the
        // individual day cells so the outline hugs the real days (a stepped
        // shape), while out-of-month spacers stay blank. The radius + overflow
        // simply round the outer corners (header top + bottom-left day cell).
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
      }}
    >
      {/* Weekday header (always full width) */}
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

      {/* Day cells */}
      {weeks.map((week, weekIndex) => (
        <Box
          key={weekIndex}
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
          }}
        >
          {week.map((cell, dayIndex) => {
            // Trailing blanks (after the last day) render empty so the grid
            // outline steps away at the end.
            if (!inBlock(cell, weekIndex)) {
              return <Box key={cell.dateStr} />;
            }

            // Border rules: a block cell always draws its right + bottom edges.
            // It adds a left edge when its left neighbour is outside the block
            // and a top edge when the cell above is outside it (the header
            // already closes the top of week 0). This yields a clean 1px
            // outline: full dividers at the start, stepped at the end.
            const leftInBlock = inBlock(week[dayIndex - 1], weekIndex);
            const topInBlock = inBlock(weeks[weekIndex - 1]?.[dayIndex], weekIndex - 1);
            const borderSx = {
              borderRight: LINE,
              borderBottom: LINE,
              ...(leftInBlock ? {} : { borderLeft: LINE }),
              ...(weekIndex > 0 && !topInBlock ? { borderTop: LINE } : {}),
            };
            const weekendBg = cell.isWeekend
              ? 'rgba(var(--accent-main-base), 0.04)'
              : 'var(--white)';

            // Leading blanks (before the 1st): keep the dividers but no content,
            // with a muted accent-100 fill to read as "outside the month".
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

            const hasMeetings = cell.badges.length > 0;
            const visible = cell.badges.slice(0, DESKTOP_MAX_BADGES);
            const hidden = Math.max(0, cell.badges.length - DESKTOP_MAX_BADGES);

            return (
              <Box
                key={cell.dateStr}
                role={hasMeetings ? 'button' : undefined}
                tabIndex={hasMeetings ? 0 : undefined}
                onClick={hasMeetings ? () => onSelectDay(cell.date) : undefined}
                onKeyDown={
                  hasMeetings
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectDay(cell.date);
                        }
                      }
                    : undefined
                }
                aria-label={
                  hasMeetings
                    ? `${cell.dayNumber} – ${cell.badges.length} meeting${cell.badges.length !== 1 ? 's' : ''}`
                    : undefined
                }
                sx={{
                  minHeight: tabletUp ? '128px' : '64px',
                  ...borderSx,
                  padding: tabletUp ? '8px' : '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: tabletUp ? 'stretch' : 'center',
                  gap: '4px',
                  // Weekend cells get a subtle tint; today has no special bg.
                  backgroundColor: weekendBg,
                  // Empty days are not interactive.
                  cursor: hasMeetings ? 'pointer' : 'default',
                  ...(hasMeetings
                    ? { '&:hover': { backgroundColor: 'var(--accent-100)' } }
                    : {}),
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
                  <Typography
                    className="body-small-semibold"
                    color="var(--black)"
                  >
                    {cell.dayNumber}
                  </Typography>
                  {cell.isToday && (
                    <Box
                      aria-hidden
                      sx={{
                        width: tabletUp ? '12px' : '8px',
                        height: tabletUp ? '12px' : '8px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-main)',
                        flexShrink: 0,
                      }}
                    />
                  )}
                </Box>

                {hasMeetings && (
                  <Box
                    sx={{
                      // Anchor the badges to the bottom; they stack upward and
                      // the "x more" line always sits at the very bottom.
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
                            key={`${cell.dateStr}-${index}`}
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
                          {cell.badges.length}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

export default MonthView;
