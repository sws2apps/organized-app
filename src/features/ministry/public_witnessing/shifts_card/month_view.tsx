import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { dayNamesShortState, dayNamesState } from '@states/app';
import { dateFormatFriendly } from '@utils/date';
import MonthCalendar from '@components/month_calendar';
import { MonthCalendarDay } from '@components/month_calendar/index.types';
import Typography from '@components/typography';
import ShiftsEmpty from './shifts_empty';
import Badge from '@components/badge';
import { DayShiftsType, MonthViewProps } from './index.types';

const countShifts = (day: DayShiftsType) => ({
  available: day.slots.filter(
    (slot) => slot.status === 'available' || slot.status === 'partner_needed'
  ).length,
  occupied: day.slots.filter(
    (slot) =>
      slot.status === 'full' ||
      (slot.status === 'past' && slot.publishers.length > 0)
  ).length,
  isOver: day.slots.every((slot) => slot.status === 'past'),
});

const countColor = (isOver: boolean, available: number) => {
  if (isOver) return 'var(--grey-350)';
  return available > 0 ? 'var(--accent-main)' : 'var(--red-main)';
};

const MonthView = ({ days, onSelectDay }: MonthViewProps) => {
  const { t } = useAppTranslation();

  const dayNames = useAtomValue(dayNamesState);
  const dayNamesShort = useAtomValue(dayNamesShortState);

  const hasShifts = days.some((day) => day.slots.length > 0);

  const weeks = Array.from({ length: Math.ceil(days.length / 7) }, (_, week) =>
    days.slice(week * 7, week * 7 + 7)
  );

  const byDate = new Map(days.map((day) => [day.date, day]));

  const calendarWeeks = weeks.map((week) =>
    week.map<MonthCalendarDay>((day) => ({
      date: day.dateObj,
      dateStr: day.date,
      dayNumber: day.dateObj.getDate(),
      inMonth: day.inPeriod,
      isToday: day.isToday,
      isWeekend: day.dateObj.getDay() === 0 || day.dateObj.getDay() === 6,
    }))
  );

  const weekdayLabels = (weeks.at(0) ?? []).map(
    (day) => dayNames[day.dateObj.getDay()]
  );

  const renderDay = (calendarDay: MonthCalendarDay) => {
    const day = byDate.get(calendarDay.dateStr);
    if (!day || day.slots.length === 0) return null;

    const { available, occupied, isOver } = countShifts(day);

    if (isOver && occupied === 0) return null;

    const color = countColor(isOver, available);

    return (
      <>
        <Box
          sx={{
            marginTop: 'auto',
            '@container (min-width: 700px)': { display: 'none' },
            alignSelf: 'center',
            minWidth: '20px',
            padding: '0 6px',
            borderRadius: 'var(--radius-s)',
            border: `1px solid ${color}`,
          }}
        >
          <Typography
            className="label-small-medium"
            sx={{ color: color, textAlign: 'center' }}
          >
            {isOver ? occupied : available}
          </Typography>
        </Box>
        <Box
          sx={{
            marginTop: 'auto',
            display: 'none',
            '@container (min-width: 700px)': { display: 'flex' },
            flexDirection: 'column',
            gap: '4px',
            width: '100%',
            minWidth: 0,
            overflowWrap: 'anywhere',
          }}
        >
          <Badge
            size="small"
            color="accent"
            text={t('tr_occupied', { number: occupied })}
            multiLine
            borderStyle="dashed"
            fullWidth
            centerContent
            // Longhands: the badge already sets the `border` shorthand, and a
            // second one in sx would be overwritten by its own borderStyle.
            sx={{
              background: 'transparent',
              borderWidth: '1px',
              borderColor: 'var(--accent-300)',
            }}
          />
          {!isOver && (
            <Badge
              size="small"
              filled
              multiLine
              color={available > 0 ? 'accent' : 'red'}
              text={t('tr_available', { number: available })}
              fullWidth
              centerContent
            />
          )}
        </Box>
      </>
    );
  };

  const dayAriaLabel = (calendarDay: MonthCalendarDay) => {
    const day = byDate.get(calendarDay.dateStr);
    if (!day || day.slots.length === 0) return calendarDay.dateStr;

    const { available, occupied, isOver } = countShifts(day);

    return [
      dateFormatFriendly(day.date),
      (!isOver || occupied > 0) && t('tr_occupied', { number: occupied }),
      !isOver && t('tr_available', { number: available }),
    ]
      .filter(Boolean)
      .join(', ');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        containerType: 'inline-size',
        minWidth: 0,
      }}
    >
      {!hasShifts && <ShiftsEmpty message={t('tr_noShiftsScheduled')} />}
      {hasShifts && (
        <Typography
          className="body-small-regular"
          sx={{
            color: 'var(--grey-400)',
            '@container (min-width: 700px)': { display: 'none' },
          }}
        >
          {t('tr_PWMonthCountsLegend')}
        </Typography>
      )}

      <MonthCalendar
        weeks={calendarWeeks}
        weekdayLabels={weekdayLabels}
        weekdayShortLabels={(weeks.at(0) ?? []).map(
          (day) => dayNamesShort[day.dateObj.getDay()]
        )}
        renderDay={renderDay}
        isDaySelectable={(calendarDay) =>
          (byDate.get(calendarDay.dateStr)?.slots.length ?? 0) > 0
        }
        dayAriaLabel={dayAriaLabel}
        onSelectDay={(calendarDay) => onSelectDay(calendarDay.dateStr)}
      />
    </Box>
  );
};

export default MonthView;
