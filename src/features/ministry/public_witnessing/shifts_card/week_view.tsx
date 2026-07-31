import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { dayNamesState } from '@states/app';
import { formatDateShortMonth } from '@utils/date';
import Typography from '@components/typography';
import ShiftCell from './shift_cell';
import ShiftsEmpty from './shifts_empty';
import { DayShiftsType, ShiftsViewProps } from './index.types';

const headerColors = (day: DayShiftsType, past: boolean) => {
  if (day.isToday) return { date: 'var(--accent-dark)', weekday: 'var(--grey-400)' };
  if (past) return { date: 'var(--grey-350)', weekday: 'var(--grey-350)' };
  return { date: 'var(--black)', weekday: 'var(--grey-400)' };
};

const WeekView = ({ days, canInteract, onSelectSlot }: ShiftsViewProps) => {
  const { t } = useAppTranslation();
  const { desktopUp } = useBreakpoints();

  const dayNames = useAtomValue(dayNamesState);

  const [expanded, setExpanded] = useState<string[]>([]);

  const toggleSlot = (key: string) => {
    setExpanded((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    );
  };

  const hasShifts = days.some((day) => day.slots.length > 0);

  const isPastDay = (day: DayShiftsType) =>
    day.slots.length > 0 && day.slots.every((slot) => slot.status === 'past');

  const dayHeader = (day: DayShiftsType) => {
    const colors = headerColors(day, isPastDay(day));

    return (
      <Stack spacing="2px" sx={{ minWidth: 0 }}>
        <Typography className="body-small-semibold" color={colors.date}>
          {formatDateShortMonth(day.dateObj)}
        </Typography>
        <Typography className="body-small-regular" color={colors.weekday}>
          {dayNames[day.dateObj.getDay()]}
        </Typography>
      </Stack>
    );
  };

  if (!hasShifts) {
    return <ShiftsEmpty message={t('tr_noShiftsScheduled')} />;
  }

  if (!desktopUp) {
    return (
      <Stack spacing="16px">
        {days
          .filter((day) => day.slots.length > 0)
          .map((day) => (
            <Stack key={day.date} spacing="8px">
              {dayHeader(day)}
              {day.slots.map((slot) => (
                <ShiftCell
                  key={slot.start_time}
                  slot={slot}
                  interactive={canInteract(slot)}
                  onClick={() => onSelectSlot(slot)}
                />
              ))}
            </Stack>
          ))}
      </Stack>
    );
  }

  const rowCount = Math.max(...days.map((day) => day.slots.length));

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
        // Column gap 16px: the divider sits in its middle, 8px clear on
        // either side. Rows keep the tighter 8px rhythm.
        gap: '8px 16px',
      }}
    >
      {/* Column separators, drawn in the middle of the grid gap so they span
          the header and every shift row. The end line is spelled out: with
          implicit rows, `1 / -1` would only cover the header. */}
      {days.slice(1).map((day, index) => (
        <Box
          key={`divider-${day.date}`}
          aria-hidden
          sx={{
            gridColumn: index + 2,
            gridRow: `1 / ${rowCount + 2}`,
            marginLeft: '-8px',
            borderLeft: '1px solid var(--accent-200)',
            pointerEvents: 'none',
          }}
        />
      ))}

      {days.map((day, column) => (
        <Box key={day.date} sx={{ gridColumn: column + 1, gridRow: 1 }}>
          {dayHeader(day)}
        </Box>
      ))}

      {days.map((day, column) =>
        day.slots.map((slot, row) => {
          const key = `${day.date}-${slot.start_time}`;

          return (
            <Box
              key={key}
              sx={{
                display: 'grid',
                gridColumn: column + 1,
                gridRow: row + 2,
                alignSelf: 'start',
                minWidth: 0,
              }}
            >
              <ShiftCell
                compact
                slot={slot}
                interactive={canInteract(slot)}
                expanded={expanded.includes(key)}
                onToggle={() => toggleSlot(key)}
                onClick={() => onSelectSlot(slot)}
              />
            </Box>
          );
        })
      )}
    </Box>
  );
};

export default WeekView;
