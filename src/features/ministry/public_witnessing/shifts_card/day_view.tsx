import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import ShiftCell from './shift_cell';
import ShiftsEmpty from './shifts_empty';
import { ShiftsViewProps } from './index.types';

const DayView = ({ days, canInteract, onSelectSlot }: ShiftsViewProps) => {
  const { t } = useAppTranslation();

  const slots = days.at(0)?.slots ?? [];

  if (slots.length === 0) {
    return <ShiftsEmpty message={t('tr_noShiftsForThisDay')} />;
  }

  return (
    <Stack
      sx={{
        display: 'grid',
        gridTemplateColumns: 'max-content minmax(0, 1fr)',
        gap: '12px 24px',
      }}
    >
      {slots.map((slot) => (
        <ShiftCell
          key={`${slot.start_time}-${slot.end_time}`}
          slot={slot}
          interactive={canInteract(slot)}
          onClick={() => onSelectSlot(slot)}
        />
      ))}
    </Stack>
  );
};

export default DayView;
