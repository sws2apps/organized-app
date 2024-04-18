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
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const TimePickerSliderContext = createContext(null);

// Used to center the cards
// const BlankCase = () => {
//   return <Box sx={TimePickerCaseStyle} />;
// };

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
  const maxHours = ampm ? 12 : 24;

  for (let h = -1; h <= maxHours; h++) {
    const value = (h + maxHours) % maxHours;
    hours.push(<TimePickerCase key={h} value={value} />);
  }

  return <>{hours}</>;
};

const TimePickerMinutesCases = () => {
  const minutes = [];
  for (let m = -1; m < 61; m++) {
    const value = (m + 60) % 60;
    minutes.push(<TimePickerCase key={m} value={value} />);
  }

  return <>{minutes}</>;
};

const TimePickerSelector = ({ children, variant }: { children: React.ReactNode; variant: 'minutes' | 'hours' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { setTimePickerSliderData } = useContext(TimePickerSliderContext);

  const disactiveBox = (box: Element) => {
    if (box.firstElementChild) (box.firstElementChild as HTMLElement).style.color = 'var(--grey-200)';
  };
  const activeBox = (box: Element) => {
    if (box.firstElementChild) (box.firstElementChild as HTMLElement).style.color = 'var(--accent-dark)';
  };

  // Add active class to the center box
  const updateActiveBox = useCallback(() => {
    const container = containerRef.current;
    const scrollPosition = container.scrollTop;

    const boxes = container.children;
    const centerBox = boxes[Math.round(scrollPosition / CASE_SIZE) + 1];

    for (let index = 0; index < boxes.length; index++) {
      disactiveBox(boxes[index]);
    }
    activeBox(centerBox);

    if (variant === 'hours') {
      setTimePickerSliderData((prev) => ({
        ...prev,
        hours: centerBox.textContent,
      }));
    } else {
      setTimePickerSliderData((prev) => ({
        ...prev,
        minutes: centerBox.textContent,
      }));
    }
  }, [setTimePickerSliderData, variant]);

  // Scroll [unit] case up or down
  const scroll = (unit: number) => {
    const container = containerRef.current;
    if (!container) return;

    const scrollHeight = container.scrollHeight;
    const scrollPosition = container.scrollTop;
    const maxScroll = scrollHeight - container.clientHeight;

    let newScrollPosition = scrollPosition + unit * CASE_SIZE;

    if (newScrollPosition < 0) {
      newScrollPosition = maxScroll;
    } else if (newScrollPosition > maxScroll) {
      newScrollPosition = 0;
    }

    container.scrollTo({ top: newScrollPosition, behavior: 'instant' });
  };

  useEffect(updateActiveBox, [updateActiveBox]);

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

const TimePickerHours = ({ ampm }: { ampm: boolean }) => {
  return (
    <TimePickerSelector variant="hours">
      <TimePickerHourCases ampm={ampm} />
    </TimePickerSelector>
  );
};

const TimePickerMinutes = () => {
  return (
    <TimePickerSelector variant="minutes">
      <TimePickerMinutesCases />
    </TimePickerSelector>
  );
};

const CPETimePickerSlider = ({ ampm, onChange }: CPETimePickerSliderProps) => {
  const [timePickerSliderData, setTimePickerSliderData] = useState({
    hours: '00',
    minutes: '00',
  });

  const convertToSeconds = (hours: string, minutes: string): number => {
    const hoursInSeconds = parseInt(hours) * 3600;
    const minutesInSeconds = parseInt(minutes) * 60;
    return hoursInSeconds + minutesInSeconds;
  };

  useEffect(() => {
    onChange(convertToSeconds(timePickerSliderData.hours, timePickerSliderData.minutes));
  }, [onChange, timePickerSliderData]);

  const contextValue = useMemo(
    () => ({
      timePickerSliderData,
      setTimePickerSliderData,
    }),
    [timePickerSliderData]
  );

  return (
    <TimePickerSliderContext.Provider value={contextValue}>
      <Box sx={TimePickerContainerStyle}>
        <TimePickerHours ampm={ampm} />

        <Box sx={{ width: CASE_SIZE, display: 'flex', justifyContent: 'center' }}>
          <Typography sx={TimePickerTypography}>:</Typography>
        </Box>

        <TimePickerMinutes />
      </Box>
    </TimePickerSliderContext.Provider>
  );
};

export default CPETimePickerSlider;
