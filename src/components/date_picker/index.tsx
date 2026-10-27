import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { getWeeksInMonth, isValid } from 'date-fns';
import { getPickerDateDefault, isPickerDateAllowed } from '@utils/pickers';
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
  const poperRef = useRef<HTMLDivElement>(null);
  const defaultPending = useRef(false);

  const shortDateFormatDefault = useAtomValue(shortDateFormatState);

  const shortDateFormatLocale = shortDateFormat || shortDateFormatDefault;

  const [height, setHeight] = useState(240); // Initial height
  const [open, setOpen] = useState(false);
  const [valueTmp, setValueTmp] = useState<Date | null>(value ?? null);
  const bounds = { minDate, maxDate, disablePast };

  const handleOpen = () => {
    if (readOnly || open) return;
    if (valueTmp === null) {
      const initial = getPickerDateDefault(bounds);
      setValueTmp(initial);
      defaultPending.current = initial !== null;
    }
    setOpen(true);
  };

  const handleClose = () => {
    if (defaultPending.current) setValueTmp(value ?? null);
    defaultPending.current = false;
    setOpen(false);
  };

  const handleAccept = () => {
    if (readOnly || !isPickerDateAllowed(valueTmp, bounds)) return;
    if (defaultPending.current) onChange?.(valueTmp);
    defaultPending.current = false;
    setOpen(false);
  };

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
    if (
      e.key !== 'Enter' ||
      (e.target instanceof Element && e.target.closest('button')) ||
      readOnly ||
      !isPickerDateAllowed(valueTmp, bounds)
    )
      return;
    onChange?.(valueTmp);
    defaultPending.current = false;
    setOpen(false);
  };

  const handleValueChange = (newValue: Date | null) => {
    if (readOnly) return;
    const isValidDate = newValue instanceof Date && isValid(newValue);

    // Mirror every change locally so the controlled picker stays in sync
    // with its own field state. Only settled values reach the parent:
    // incomplete drafts and the low-year artifacts emitted while typing
    // the year section (e.g. 0002 en route to 2026) must not propagate,
    // since parents stringify and parse them back as a different date,
    // which scrambles or wipes the entry. An explicit clear (null) is
    // always forwarded.
    setValueTmp(newValue);
    defaultPending.current = false;

    if (newValue !== null && !isPickerDateAllowed(newValue, bounds)) return;

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
    defaultPending.current = false;
    if (readOnly) setOpen(false);
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
  }, [value, readOnly]);

  return (
    <ClickAwayListener onClickAway={handleClose}>
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
          onAccept={handleAccept}
          onMonthChange={changeHeight}
          onOpen={handleOpen}
          onClose={handleClose}
          slots={{
            ...slotFieldProps,
            toolbar: () => <Toolbar selected={valueTmp} />,
            actionBar: () => (
              <ActionBar
                onClose={handleClose}
                onAccept={handleAccept}
                acceptDisabled={!isPickerDateAllowed(valueTmp, bounds)}
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
              onClick: handleOpen,
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
