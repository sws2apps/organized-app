import { useMemo, useState } from 'react';
import { TimePickerSliderProps } from './index.types';
import {
  formatTimeUnit,
  getNextValue,
  getPrevValue,
  validateHours,
  validateMinutes,
} from './index.utils';
import { Box } from '@mui/material';
import TimeUnit from './TimeUnit';
import {
  CASE_SIZE,
  TimePickerContainerStyle,
  TimePickerTypography,
} from './index.styles';
import Typography from '@components/typography';

const TimePickerSlider = ({ value, onChange }: TimePickerSliderProps) => {
  const { initialHours, initialMinutes } = useMemo(() => {
    // Convert seconds to hours, minutes
    const seconds = value % 60;

    const minutesTotal = (value - seconds) / 60;
    const minutes = minutesTotal % 60;

    const hoursTotal = value - seconds - minutes * 60;
    const hours = hoursTotal / 3600;

    return {
      initialHours: String(hours).padStart(2, '0'),
      initialMinutes: String(minutes).padStart(2, '0'),
    };
  }, [value]);

  const [hours, setHours] = useState(() => validateHours(initialHours));
  const [minutes, setMinutes] = useState(() => validateMinutes(initialMinutes));

  const convertToSeconds = (hours: string, minutes: string) => {
    const hoursInSeconds = parseInt(hours) * 3600;
    const minutesInSeconds = parseInt(minutes) * 60;
    return hoursInSeconds + minutesInSeconds;
  };

  const handleHourChange = (newHours: string) => {
    setHours(newHours);

    const value = convertToSeconds(newHours, minutes);
    onChange(value);
  };

  const handleMinuteChange = (newMinutes: string) => {
    setMinutes(newMinutes);
    const value = convertToSeconds(hours, newMinutes);
    onChange(value);
  };

  const incrementHours = () => {
    const newValue = (parseInt(hours, 10) + 1) % 24;
    handleHourChange(formatTimeUnit(newValue));
  };

  const decrementHours = () => {
    const newValue = (parseInt(hours, 10) - 1 + 24) % 24;
    handleHourChange(formatTimeUnit(newValue));
  };

  const incrementMinutes = () => {
    const newValue = (parseInt(minutes, 10) + 1) % 60;
    handleMinuteChange(formatTimeUnit(newValue));
  };

  const decrementMinutes = () => {
    const newValue = (parseInt(minutes, 10) - 1 + 60) % 60;
    handleMinuteChange(formatTimeUnit(newValue));
  };

  return (
    <Box sx={TimePickerContainerStyle}>
      <TimeUnit
        value={hours}
        prevValue={getPrevValue(parseInt(hours, 10), 24)}
        nextValue={getNextValue(parseInt(hours, 10), 24)}
        onIncrement={incrementHours}
        onDecrement={decrementHours}
      />

      <Box sx={{ width: CASE_SIZE, display: 'flex', justifyContent: 'center' }}>
        <Typography className="h3" sx={TimePickerTypography}>
          :
        </Typography>
      </Box>

      <TimeUnit
        value={minutes}
        prevValue={getPrevValue(parseInt(minutes, 10), 60)}
        nextValue={getNextValue(parseInt(minutes, 10), 60)}
        onIncrement={incrementMinutes}
        onDecrement={decrementMinutes}
      />
    </Box>
  );
};

export default TimePickerSlider;
