import { useMemo } from 'react';
import { Box } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import { generateDateFromTime, formatDate } from '@utils/date';
import { IconDelete } from '@components/icons';
import IconButton from '@components/icon_button';
import TimePicker from '@components/time_picker';
import { ShiftRowProps } from './index.types';

// Separate component so the TimePicker Date values keep a stable identity —
// the picker resets its in-progress edit whenever the value prop changes.
const ShiftRow = ({
  shift,
  hour24,
  startLabel,
  endLabel,
  onChange,
  onRemove,
}: ShiftRowProps) => {
  const { tabletUp, tablet688Up } = useBreakpoints();

  const startValue = useMemo(
    () => generateDateFromTime(shift.start_time),
    [shift.start_time]
  );
  const endValue = useMemo(
    () => generateDateFromTime(shift.end_time),
    [shift.end_time]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: tabletUp ? '10px' : '8px',
      }}
    >
      <TimePicker
        label={startLabel}
        ampm={!hour24}
        hideIcon={!tablet688Up}
        value={startValue}
        onChange={(value) =>
          value && onChange('start_time', formatDate(value, 'HH:mm'))
        }
        sx={{ flex: '1 1 0', minWidth: 0 }}
      />
      {tabletUp && (
        <Box
          sx={{
            width: '16px',
            height: '1px',
            backgroundColor: 'var(--grey-300)',
            flexShrink: 0,
          }}
        />
      )}
      <TimePicker
        label={endLabel}
        ampm={!hour24}
        hideIcon={!tablet688Up}
        value={endValue}
        onChange={(value) =>
          value && onChange('end_time', formatDate(value, 'HH:mm'))
        }
        sx={{ flex: '1 1 0', minWidth: 0 }}
      />
      <IconButton
        color="error"
        onClick={onRemove}
        sx={{
          borderRadius: 'var(--radius-m)',
          width: tabletUp ? '48px' : '40px',
          height: tabletUp ? '48px' : '40px',
          padding: tabletUp ? '12px' : '8px',
          flexShrink: 0,
          marginLeft: 0,
        }}
      >
        <IconDelete color="var(--red-main)" />
      </IconButton>
    </Box>
  );
};

export default ShiftRow;
