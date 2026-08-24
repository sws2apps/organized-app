import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import ShiftCell from './shift_cell';
import ShiftsEmpty from './shifts_empty';
import { ShiftsViewProps } from './index.types';

const DayView = ({ days, canInteract, onSelectSlot }: ShiftsViewProps) => {
  const { t } = useAppTranslation();

  const slots = days.at(0)?.slots ?? [];

  return (
    <Stack spacing="12px">
      {slots.length === 0 && (
        <ShiftsEmpty message={t('tr_noShiftsForThisDay')} />
      )}

      {slots.map((slot) => (
        <ShiftCell
          key={slot.start_time}
          slot={slot}
          interactive={canInteract(slot)}
          onClick={() => onSelectSlot(slot)}
        />
      ))}
    </Stack>
  );
};

export default DayView;
