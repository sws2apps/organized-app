import { useState } from 'react';
import { Box } from '@mui/material';
import { TimePickerSliderProps } from './index.types';
import {
  CASE_SIZE,
  TimePickerContainerStyle,
  TimePickerTypography,
} from './index.styles';
import TimeUnit from './TimeUnit';
import Typography from '@components/typography';

const TimePickerSlider = ({ value, onChange }: TimePickerSliderProps) => {
  const [hours, setHours] = useState(() => {
    const hours = Math.floor(value / 3600);

    return hours < 24 ? hours : 0;
  });

  const [minutes, setMinutes] = useState(() => Math.floor(value / 60) % 60);

  const handleHoursChange = (value: number) => {
    setHours(value);
    onChange(value * 3600 + minutes * 60);
  };

  const handleMinutesChange = (value: number) => {
    setMinutes(value);
    onChange(hours * 3600 + value * 60);
  };

  return (
    <Box sx={TimePickerContainerStyle}>
      <TimeUnit defaultValue={hours} max={24} onChange={handleHoursChange} />

      <Box sx={{ width: CASE_SIZE, display: 'flex', justifyContent: 'center' }}>
        <Typography className="h3" sx={TimePickerTypography}>
          :
        </Typography>
      </Box>

      <TimeUnit
        defaultValue={minutes}
        max={60}
        onChange={handleMinutesChange}
      />
    </Box>
  );
};

export default TimePickerSlider;
