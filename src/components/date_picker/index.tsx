import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { getWeeksInMonth, format, isValid } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Box, ClickAwayListener, Stack } from '@mui/material';
import { ArrowDropDown, ArrowLeft, ArrowRight } from '@mui/icons-material';
import Button from '@components/button';
import Typography from '@components/typography';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { CustomDatePickerProps } from './date_picker.types';
import ButtonField, { FieldProps } from './view/button';
import DatePickerInputField from './view/input';
import {
  StyleDatePickerActionBar,
  StyleDatePickerDay,
  StyleDatePickerDesktopPaper,
  StyleDatePickerLayout,
  StyleDatePickerPopper,
  StyleDatePickerToolbar,
} from './date_picker.styles';
import { useAppTranslation } from '@hooks/index';
import { shortDateFormatState } from '@states/settings';

/**
 * Component for a custom date picker.
 * @param {CustomDatePickerProps} props - Props for the CustomDatePicker component.
 * @param {Date} props.value - The selected date value.
 * @param {('button' | 'input')} props.view - The view mode of the date picker, either 'button' or 'input'.
 * @param {string} props.label - The label for the date picker.
 * @param {boolean} props.disablePast - Indicates whether to disable selection of past dates.
 * @param {string} props.shortDateFormat - The short date format string.
 * @param {string} props.longDateFormat - The long date format string.
 * @param {Date} props.maxDate - The maximum selectable date.
 * @param {Date} props.minDate - The minimum selectable date.
 * @param {(value: Date) => void | Promise<void>} props.onChange - Function called when the selected date changes.
 * @returns {JSX.Element} CustomDatePicker component.
 */
const DatePicker = ({
  value = null,
  onChange,
  view = 'input',
  label,
  disablePast,
  shortDateFormat,
  longDateFormat,
  maxDate = null,
  minDate = null,
  readOnly = false,
  hideNav = false,
}: CustomDatePickerProps) => {
  const { t } = useAppTranslation();

  const inputRef = useRef<HTMLInputElement>(null);

  const shortDateFormatDefault = useRecoilValue(shortDateFormatState);

  const shortDateFormatLocale = shortDateFormat || shortDateFormatDefault;
  const longDateFormatLocale = longDateFormat || t('tr_longDateFormat');

  const [open, setOpen] = useState<boolean>(false);
  const [valueTmp, setValueTmp] = useState<Date | null>(value);
  const [innerValue, setInnerValue] = useState<Date | null>(value);

  const [height, setHeight] = useState(240); // Initial height

  const changeHeight = (event) => {
    if (
      getWeeksInMonth(new Date(event), { locale: enUS, weekStartsOn: 0 }) === 6
    )
      setHeight(290);
    else setHeight(240);
  };

  const handleClickAway = () => {
    if (open) setOpen(false);
  };

  const viewProps =
    view === 'button'
      ? { field: ButtonField }
      : { textField: DatePickerInputField };

  const handleFormatSelected = (value) => {
    if (isNaN(Date.parse(value))) return '***';

    return format(value, longDateFormatLocale);
  };

  const handleValueChange = (value: Date) => {
    setInnerValue(value);

    const isValidDate = isValid(value);

    if (view === 'input' && !open && isValidDate) {
      setValueTmp(value);
      onChange?.(value);
    }

    if (view === 'button') {
      setValueTmp(value);
      setOpen(false);
      onChange?.(value);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<Element>) => {
    if (e.key !== 'Enter') return;

    const isValidDate = isValid(innerValue);

    if (!isValidDate) return;

    setValueTmp(innerValue);
    setOpen(false);
    onChange?.(innerValue);
  };

  useEffect(() => {
    if (getWeeksInMonth(new Date(), { locale: enUS, weekStartsOn: 0 }) === 6)
      setHeight(290);
  }, []);

  useEffect(() => {
    if (value === null && open) setInnerValue(new Date());
  }, [value, open]);

  useEffect(() => {
    setValueTmp(value);
    setInnerValue(value);
  }, [value]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ width: '100%' }}>
        <DesktopDatePicker
          readOnly={readOnly}
          slots={{
            ...viewProps,
            actionBar:
              view === 'button'
                ? null
                : () => (
                    <Stack
                      direction={'row'}
                      justifyContent={'space-between'}
                      p={'12px'}
                      gap={'12px'}
                    >
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setOpen(false);
                          setValueTmp(null);
                          onChange?.(null);
                        }}
                      >
                        {t('tr_clear')}
                      </Button>
                      <Button
                        variant="main"
                        onClick={() => {
                          setValueTmp(innerValue);
                          onChange?.(innerValue);
                          setOpen(false);
                        }}
                      >
                        OK
                      </Button>
                    </Stack>
                  ),
            toolbar:
              view === 'button'
                ? null
                : () => (
                    <Stack
                      direction={'column'}
                      sx={{
                        padding: '16px 12px 12px 24px',
                        borderBottom: '1px solid var(--accent-200)',
                      }}
                    >
                      <Typography
                        className="body-small-semibold"
                        color={'var(--grey-400)'}
                      >
                        {t('tr_pickerSelectDate')}
                      </Typography>
                      <Typography className="h2">{`${handleFormatSelected(innerValue)}`}</Typography>
                    </Stack>
                  ),
            leftArrowIcon: hideNav ? () => <></> : ArrowLeft,
            rightArrowIcon: hideNav ? () => <></> : ArrowRight,
            switchViewIcon: hideNav ? () => <></> : ArrowDropDown,
          }}
          open={!readOnly && open}
          minDate={minDate}
          maxDate={maxDate}
          disablePast={disablePast}
          yearsPerRow={3}
          showDaysOutsideCurrentMonth={!hideNav}
          onMonthChange={changeHeight}
          onChange={handleValueChange}
          onOpen={() => {
            if (readOnly) return;
            setOpen(true);
          }}
          value={valueTmp}
          slotProps={{
            textField: {
              inputRef,
              onClick: () => {
                if (readOnly) return;
                setOpen(true);
              },
              label: label,
              value: valueTmp,
              InputProps: { readOnly },
            },
            field: {
              className: 'btn-date-picker',
              format: shortDateFormatLocale,
              setOpen: setOpen,
              value: valueTmp,
              onKeyDown: handleKeyDown,
            } as FieldProps,
            popper: {
              anchorEl:
                view === 'input'
                  ? inputRef.current
                  : document.querySelector('.btn-date-picker'),
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
            layout: StyleDatePickerLayout,
            day: StyleDatePickerDay,
            desktopPaper: StyleDatePickerDesktopPaper,
            toolbar: StyleDatePickerToolbar,
            actionBar: StyleDatePickerActionBar,
          }}
        />
      </Box>
    </ClickAwayListener>
  );
};

export default DatePicker;
