import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { getWeeksInMonth, isValid } from 'date-fns';
import { Box, ClickAwayListener } from '@mui/material';
import { ArrowDropDown, ArrowLeft, ArrowRight } from '@mui/icons-material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { IconDate } from '@components/icons';
import { shortDateFormatState } from '@states/settings';
import { CustomDatePickerProps } from './index.types';
import {
  StyleDatePickerActionBar,
  StyleDatePickerDay,
  StyleDatePickerDesktopPaper,
  StyleDatePickerLayout,
  StyleDatePickerPopper,
  StyleDatePickerToolbar,
} from './index.styles';
import ActionBar from './slots/actionBar';
import ButtonField from './view/button';
import InputTextField from './view/input';
import Toolbar from './slots/toolbar';

const DatePicker = ({
  label,
  value,
  onChange,
  readOnly,
  maxDate,
  minDate,
  disablePast,
  shortDateFormat,
  view,
  hideNav,
  sx = {},
}: CustomDatePickerProps) => {
  const poperRef = useRef<HTMLDivElement>(null);

  const shortDateFormatDefault = useAtomValue(shortDateFormatState);

  const shortDateFormatLocale = shortDateFormat || shortDateFormatDefault;

  const [height, setHeight] = useState(240); // Initial height
  const [open, setOpen] = useState(false);
  const [valueTmp, setValueTmp] = useState<Date>(value);

  const slotFieldProps =
    view === 'button' ? { field: ButtonField } : { textField: InputTextField };

  const changeHeight = (event) => {
    if (getWeeksInMonth(new Date(event), { weekStartsOn: 0 }) === 6) {
      setHeight(290);
    } else {
      setHeight(240);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<Element>) => {
    if (e.key !== 'Enter') return;

    const isValidDate = isValid(valueTmp);

    if (!isValidDate) return;

    onChange?.(valueTmp);
    setOpen(false);
  };

  const handleValueChange = (value: Date) => {
    setValueTmp(value);

    const isValidDate = isValid(value);

    onChange?.(value);

    if (view === 'input' && !open && isValidDate) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (getWeeksInMonth(valueTmp, { weekStartsOn: 0 }) === 6) {
      setHeight(290);
    } else {
      setHeight(240);
    }
  }, [valueTmp]);

  useEffect(() => {
    setValueTmp(value);
  }, [value]);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ width: '100%', ...sx }}>
        <DesktopDatePicker
          readOnly={readOnly}
          minDate={minDate}
          maxDate={maxDate}
          disablePast={disablePast}
          yearsPerRow={3}
          showDaysOutsideCurrentMonth={true}
          label={label}
          value={valueTmp}
          format={shortDateFormatLocale}
          open={!readOnly && open}
          onChange={handleValueChange}
          onMonthChange={changeHeight}
          onOpen={() => {
            if (readOnly) return;
            setOpen(true);
          }}
          slots={{
            ...slotFieldProps,
            toolbar: () => <Toolbar selected={valueTmp} />,
            actionBar: () => (
              <ActionBar
                onClose={() => setOpen(false)}
                onClear={() => {
                  setOpen(false);
                  setValueTmp(null);
                  onChange?.(null);
                }}
              />
            ),
            openPickerIcon: IconDate,
            leftArrowIcon: hideNav ? () => <></> : ArrowLeft,
            rightArrowIcon: hideNav ? () => <></> : ArrowRight,
            switchViewIcon: hideNav ? () => <></> : ArrowDropDown,
          }}
          slotProps={{
            layout: StyleDatePickerLayout,
            day: StyleDatePickerDay,
            desktopPaper: StyleDatePickerDesktopPaper,
            toolbar: StyleDatePickerToolbar,
            actionBar: StyleDatePickerActionBar,
            popper: {
              onKeyDown: handleKeyDown,
              anchorEl: poperRef.current,
              sx: {
                ...StyleDatePickerPopper,
                '.MuiDateCalendar-viewTransitionContainer': {
                  overflow: 'hidden',
                },
                '.MuiDayCalendar-slideTransition': {
                  minHeight: `${height}px`,
                  '@media (max-width:322px)': {
                    minHeight: `${height - 38}px`,
                  },
                },
              },
            },
            field: {
              className: 'btn-date-picker',
              ref: poperRef,
            },
            textField: {
              value: valueTmp,
              sx: {
                ...sx,
              },
              onClick: () => {
                if (readOnly) return;
                setOpen(true);
              },
              onKeyDown: handleKeyDown,
              ref: poperRef,
            },
          }}
        />
      </Box>
    </ClickAwayListener>
  );
};

export default DatePicker;
