import { Box, Stack } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { dayNamesShortState } from '@states/app';
import Typography from '@components/typography';
import ShiftCell from './shift_cell';
import ShiftsEmpty from './shifts_empty';
import { DayShiftsType, ShiftsViewProps } from './index.types';

const WeekView = ({ days, canInteract, onSelectSlot }: ShiftsViewProps) => {
  const { t } = useAppTranslation();
  // Seven readable columns need the wide layout — below it the card shares
  // its row with the locations list.
  const { desktopUp } = useBreakpoints();

  const dayNames = useAtomValue(dayNamesShortState);

  const hasShifts = days.some((day) => day.slots.length > 0);

  const dayHeader = (day: DayShiftsType) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        alignSelf: 'flex-start',
        padding: day.isToday ? '2px 8px' : '2px 0',
        borderRadius: 'var(--radius-s)',
        backgroundColor: day.isToday ? 'var(--accent-150)' : 'transparent',
      }}
    >
      <Typography
        className="body-small-semibold"
        color={day.isToday ? 'var(--accent-dark)' : 'var(--black)'}
      >
        {dayNames[day.dateObj.getDay()]}
      </Typography>
      <Typography
        className="body-small-regular"
        color={day.isToday ? 'var(--accent-dark)' : 'var(--grey-400)'}
      >
        {day.dateObj.getDate()}
      </Typography>
    </Box>
  );

  if (!hasShifts) {
    return <ShiftsEmpty message={t('tr_noShiftsScheduled')} />;
  }

  // Narrow screens cannot hold seven readable columns, so the week becomes a
  // list of the days that actually have shifts, laid out like the day view.
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

  // One grid for the whole week — placing every shift on its own row keeps
  // the cells of the different days aligned, whatever their height.
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
        gap: '8px',
      }}
    >
      {days.map((day, column) => (
        <Box key={day.date} sx={{ gridColumn: column + 1, gridRow: 1 }}>
          {dayHeader(day)}
        </Box>
      ))}

      {days.map((day, column) =>
        day.slots.map((slot, row) => (
          <Box
            key={`${day.date}-${slot.start_time}`}
            sx={{
              display: 'grid',
              gridColumn: column + 1,
              gridRow: row + 2,
              minWidth: 0,
            }}
          >
            <ShiftCell
              compact
              slot={slot}
              interactive={canInteract(slot)}
              onClick={() => onSelectSlot(slot)}
            />
          </Box>
        ))
      )}
    </Box>
  );
};

export default WeekView;
