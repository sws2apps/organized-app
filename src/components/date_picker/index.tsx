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
  error,
  helperText,
}: CustomDatePickerProps) => {
  // Years below this threshold are transient artifacts of typing the year
  // section (e.g. 0002 while entering 2026) and must not be propagated.
  const MIN_VALID_YEAR = 1000;

  const poperRef = useRef<HTMLDivElement>(null);

  const shortDateFormatDefault = useAtomValue(shortDateFormatState);

  const shortDateFormatLocale = shortDateFormat || shortDateFormatDefault;

  const [height, setHeight] = useState(240); // Initial height
  const [open, setOpen] = useState(false);
  const [valueTmp, setValueTmp] = useState<Date | null>(value ?? null);

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

    const isValidDate = valueTmp instanceof Date && isValid(valueTmp);

    if (!isValidDate) return;

    if (valueTmp.getFullYear() < MIN_VALID_YEAR) return;

    onChange?.(valueTmp);
    setOpen(false);
  };

  const handleValueChange = (newValue: Date | null) => {
    const isValidDate = newValue instanceof Date && isValid(newValue);

    // Mirror every change locally so the controlled picker stays in sync
    // with its own field state. Only settled values reach the parent:
    // incomplete drafts and the low-year artifacts emitted while typing
    // the year section (e.g. 0002 en route to 2026) must not propagate,
    // since parents stringify and parse them back as a different date,
    // which scrambles or wipes the entry. An explicit clear (null) is
    // always forwarded.
    setValueTmp(newValue);

    if (!isValidDate && newValue !== null) return;

    if (isValidDate && newValue.getFullYear() < MIN_VALID_YEAR) return;

    onChange?.(newValue);

    if (view === 'input' && !open && isValidDate) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (valueTmp) {
      if (getWeeksInMonth(valueTmp, { weekStartsOn: 0 }) === 6) {
        setHeight(290);
      } else {
        setHeight(240);
      }
    } else {
      setHeight(240);
    }
  }, [valueTmp]);

  useEffect(() => {
    setValueTmp((prev) => {
      const next = value ?? null;

      if (prev === null && next === null) return prev;
      if (
        prev instanceof Date &&
        next instanceof Date &&
        prev.getTime() === next.getTime()
      )
        return prev;

      return next;
    });
  }, [value]);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ width: '100%' }}>
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
            actionBar: () => <ActionBar onClose={() => setOpen(false)} />,
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
              onClick: () => {
                if (readOnly) return;
                setOpen(true);
              },
              onKeyDown: handleKeyDown,
              ref: poperRef,
              error,
              helperText,
            },
          }}
        />
      </Box>
    </ClickAwayListener>
  );
};

export default DatePicker;
