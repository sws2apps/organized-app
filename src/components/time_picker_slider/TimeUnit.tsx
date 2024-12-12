import { useEffect, useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import { TimeUnitProps } from './index.types';
import {
  ActiveCaseFilter,
  CaseContainerStyle,
  DefaultCaseFilter,
  TimePickerArrowStyle,
  TimePickerSelectorStyle,
} from './index.styles';
import { useGestureControl } from './useGestureControl';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import Typography from '@components/typography';

const TimeUnit = ({
  nextValue,
  onDecrement,
  onIncrement,
  prevValue,
  value,
}: TimeUnitProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd } =
    useGestureControl({
      onIncrement,
      onDecrement,
    });

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (element) {
      // Wheel events
      element.addEventListener('wheel', handleWheel, { passive: false });

      // Touch events
      element.addEventListener('touchstart', handleTouchStart, {
        passive: false,
      });

      element.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      });

      element.addEventListener('touchend', handleTouchEnd);

      element.addEventListener('touchcancel', handleTouchEnd);

      return () => {
        element.removeEventListener('wheel', handleWheel);
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);
        element.removeEventListener('touchcancel', handleTouchEnd);
      };
    }
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <Box sx={TimePickerSelectorStyle}>
      <IconButton onClick={onDecrement} style={TimePickerArrowStyle}>
        <KeyboardArrowUp />
      </IconButton>

      <div ref={scrollContainerRef} style={CaseContainerStyle}>
        <Box sx={DefaultCaseFilter}>
          <Typography className="h3" color="var(--grey-200)">
            {prevValue}
          </Typography>
        </Box>
        <Box sx={ActiveCaseFilter}>
          <Typography className="h3" color="var(--accent-main)">
            {value}
          </Typography>
        </Box>

        <Box sx={DefaultCaseFilter}>
          <Typography className="h3" color="var(--grey-200)">
            {nextValue}
          </Typography>
        </Box>
      </div>

      <IconButton onClick={onIncrement} style={TimePickerArrowStyle}>
        <KeyboardArrowDown />
      </IconButton>
    </Box>
  );
};

export default TimeUnit;
