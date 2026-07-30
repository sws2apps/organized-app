import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { dayNamesState } from '@states/app';
import { dateFormatFriendly } from '@utils/date';
import MonthCalendar from '@components/month_calendar';
import { MonthCalendarDay } from '@components/month_calendar/index.types';
import Typography from '@components/typography';
import ShiftsEmpty from './shifts_empty';
import Badge from '@components/badge';
import { DayShiftsType, MonthViewProps } from './index.types';

const countShifts = (day: DayShiftsType) => ({
  // Slots someone can still take, including the ones looking for a partner.
  available: day.slots.filter(
    (slot) => slot.status === 'available' || slot.status === 'partner_needed'
  ).length,
  occupied: day.slots.filter(
    (slot) =>
      slot.status === 'full' ||
      (slot.status === 'past' && slot.publishers.length > 0)
  ).length,
  // A day whose shifts have all ended can no longer be joined — it only
  // reports what was arranged.
  isOver: day.slots.every((slot) => slot.status === 'past'),
});

const MonthView = ({ days, onSelectDay }: MonthViewProps) => {
  const { t } = useAppTranslation();
  const { tabletUp } = useBreakpoints();

  const dayNames = useAtomValue(dayNamesState);

  const hasShifts = days.some((day) => day.slots.length > 0);

  // The card hands over full weeks already — the calendar grid just needs them
  // in rows of seven.
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

    // Days already over say nothing unless somebody served them.
    if (isOver && occupied === 0) return null;

    // Phone-sized cells cannot hold two labelled badges: they carry a single
    // number — the shifts still open — and say the rest through its colour.
    if (!tabletUp) {
      const countColor = isOver
        ? 'var(--grey-350)'
        : available > 0
          ? 'var(--accent-main)'
          : 'var(--red-main)';

      return (
        <Box
          sx={{
            marginTop: 'auto',
            alignSelf: 'center',
            minWidth: '20px',
            padding: '0 6px',
            borderRadius: 'var(--radius-s)',
            border: `1px solid ${countColor}`,
          }}
        >
          <Typography
            className="label-small-medium"
            color={countColor}
            sx={{ textAlign: 'center' }}
          >
            {isOver ? occupied : available}
          </Typography>
        </Box>
      );
    }

    return (
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
        <Badge
          size="small"
          className="label-small-medium"
          color="accent"
          text={t('tr_occupied', { number: occupied })}
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
        {/* A day nobody can join any more is called out in red. */}
        {!isOver && (
          <Badge
            size="small"
            className="label-small-medium"
            filled
            color={available > 0 ? 'accent' : 'red'}
            text={t('tr_available', { number: available })}
            fullWidth
            centerContent
          />
        )}
      </Box>
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {!hasShifts && <ShiftsEmpty message={t('tr_noShiftsScheduled')} />}

      <MonthCalendar
        weeks={calendarWeeks}
        weekdayLabels={weekdayLabels}
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
