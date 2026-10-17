import { useMemo } from 'react';
import { Box, IconButton } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { TimeUnitProps } from './index.types';
import {
  TimePickerArrowStyle,
  TimePickerSelectorStyle,
  WheelHighlightStyle,
  WheelScrollerStyle,
  WheelStyle,
  WheelTintStyle,
} from './index.styles';
import { formatTimeUnit } from './index.utils';
import useLoopedScroll from './useLoopedScroll';
import Typography from '@components/typography';

const TimeUnit = ({ defaultValue, max, onChange }: TimeUnitProps) => {
  const { ref, value, count, scrollToIndex, stepBy } = useLoopedScroll({
    defaultValue,
    max,
    onChange,
  });

  const rows = useMemo(
    () =>
      Array.from({ length: count }, (_, row) => (
        <div key={row} aria-hidden onClick={() => scrollToIndex(row)}>
          <Typography className="h3">{formatTimeUnit(row % max)}</Typography>
        </div>
      )),
    [count, max, scrollToIndex]
  );

  return (
    <Box sx={TimePickerSelectorStyle}>
      <IconButton onClick={() => stepBy(-1)} style={TimePickerArrowStyle}>
        <KeyboardArrowUp />
      </IconButton>

      <Box sx={WheelStyle}>
        <Box sx={WheelHighlightStyle} />

        <Box
          ref={ref}
          role="spinbutton"
          tabIndex={0}
          aria-valuemin={0}
          aria-valuemax={max - 1}
          aria-valuenow={value}
          aria-valuetext={formatTimeUnit(value)}
          sx={WheelScrollerStyle}
        >
          {rows}
        </Box>

        <Box sx={WheelTintStyle} />
      </Box>

      <IconButton onClick={() => stepBy(1)} style={TimePickerArrowStyle}>
        <KeyboardArrowDown />
      </IconButton>
    </Box>
  );
};

export default TimeUnit;
