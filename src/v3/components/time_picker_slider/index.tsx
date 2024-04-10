import { Box, IconButton, Typography } from '@mui/material';
import { CPETimePickerSliderProps } from './time_picker_slider.types';
import {
  ActiveCaseFilter,
  CASE_SIZE,
  CaseContainerStyle,
  TimePickerArrowStyle,
  TimePickerCaseStyle,
  TimePickerContainerStyle,
  TimePickerSelectorStyle,
  TimePickerTypography,
} from './time_picker.styles';
import { MutableRefObject, useEffect, useRef } from 'react';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

// Used to center the cards
const BlankCase = () => {
  return <Box sx={TimePickerCaseStyle} />;
};

const TimePickerCase = ({ value }: { value: number }) => {
  return (
    <Box sx={TimePickerCaseStyle}>
      <Typography variant="body1" component="span" sx={TimePickerTypography}>
        {value.toString().padStart(2, '0')}
      </Typography>
    </Box>
  );
};

const TimePickerHourCases = ({ ampm }: { ampm: boolean }) => {
  const hours = [];
  for (let h = 0; h <= (ampm ? 12 : 24); h++) {
    hours.push(<TimePickerCase key={h} value={h} />);
  }
  return (
    <>
      <BlankCase />
      {hours}
      <BlankCase />
    </>
  );
};

const TimePickerMinutesCases = () => {
  const minutes = [];
  for (let m = 0; m < 60; m++) {
    minutes.push(<TimePickerCase key={m} value={m} />);
  }

  return (
    <>
      <BlankCase />
      {minutes}
      <BlankCase />
    </>
  );
};

const TimePickerSelector = ({ children, value }: { children: React.ReactNode; value: MutableRefObject<string> }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const disactiveBox = (box: Element) => {
    if (box.firstElementChild) (box.firstElementChild as HTMLElement).style.color = 'var(--grey-200)';
  };
  const activeBox = (box: Element) => {
    if (box.firstElementChild) (box.firstElementChild as HTMLElement).style.color = 'var(--accent-dark)';
  };

  // Add active class to the center box
  const updateActiveBox = () => {
    const container = containerRef.current;
    const scrollPosition = container.scrollTop;

    const boxes = container.children;
    const centerBox = boxes[Math.round(scrollPosition / CASE_SIZE) + 1];

    for (let index = 0; index < boxes.length; index++) {
      disactiveBox(boxes[index]);
    }
    activeBox(centerBox);
    value.current = centerBox.textContent;
  };

  // Scroll [unit] case up or down
  const scroll = (unit: number) => {
    const container = containerRef.current;
    const scrollPosition = container.scrollTop;
    container.scrollTo({ top: scrollPosition + unit * CASE_SIZE, behavior: 'smooth' });
  };

  useEffect(updateActiveBox);

  return (
    <Box sx={TimePickerSelectorStyle}>
      <Box sx={ActiveCaseFilter}></Box>
      <IconButton onClick={() => scroll(-1)} style={TimePickerArrowStyle}>
        <KeyboardArrowUp />
      </IconButton>

      <div ref={containerRef} style={CaseContainerStyle} onScroll={updateActiveBox}>
        {children}
      </div>

      <IconButton onClick={() => scroll(1)} style={TimePickerArrowStyle}>
        <KeyboardArrowDown />
      </IconButton>
    </Box>
  );
};

const TimePickerHours = ({ ampm, value }: { ampm: boolean; value: MutableRefObject<string> }) => {
  return (
    <TimePickerSelector value={value}>
      <TimePickerHourCases ampm={ampm} />
    </TimePickerSelector>
  );
};

const TimePickerMinutes = ({ value }: { value: MutableRefObject<string> }) => {
  return (
    <TimePickerSelector value={value}>
      <TimePickerMinutesCases />
    </TimePickerSelector>
  );
};

const CPETimePickerSlider = ({ ampm }: CPETimePickerSliderProps) => {
  // Use theses in the future to get the selected time ⏰
  const hoursValue = useRef<string>('00');
  const minutesValue = useRef<string>('00');

  return (
    <Box sx={TimePickerContainerStyle}>
      <TimePickerHours ampm={ampm} value={hoursValue} />

      <Box sx={{ width: CASE_SIZE, display: 'flex', justifyContent: 'center' }}>
        <Typography sx={TimePickerTypography}>:</Typography>
      </Box>

      <TimePickerMinutes value={minutesValue} />
    </Box>
  );
};

export default CPETimePickerSlider;
