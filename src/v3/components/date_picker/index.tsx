import { useCallback, useEffect, useState } from 'react';
/* eslint-disable import/no-duplicates */
import { addYears, getWeeksInMonth, startOfYear, subYears, format } from 'date-fns';
import { enUS } from 'date-fns/locale';
/* eslint-enable import/no-duplicates */
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box, ClickAwayListener, Stack } from '@mui/material';
import Button from '@components/button';
import Typography from '@components/typography';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { CPEDatePickerProps } from './date_picker.types';
import ButtonField from './view/button';
import DatePickerInputField from './view/input';
import {
  StyleDatePickerActionBar,
  StyleDatePickerDay,
  StyleDatePickerDesktopPaper,
  StyleDatePickerLayout,
  StyleDatePickerPopper,
  StyleDatePickerToolbar,
} from './date_picker.style';
import { useAppTranslation } from '@hooks/index';

const CPEDatePicker = ({
  value = null,
  onChange,
  view = 'input',
  label,
  disablePast,
  limitYear = false,
  shortDateFormat,
  longDateFormat,
}: CPEDatePickerProps) => {
  const { t } = useAppTranslation();

  const shortDateFormatLocale = shortDateFormat || t('tr_shortDateFormat');
  const longDateFormatLocale = longDateFormat || t('tr_longDateFormat');

  const [open, setOpen] = useState<boolean>(false);
  const [valueTmp, setValueTmp] = useState<Date | null>(value);
  const [innerValue, setInnerValue] = useState<Date | null>(value);

  const [height, setHeight] = useState('300px'); // Initial height

  const changeHeight = useCallback((event) => {
    if (getWeeksInMonth(new Date(event), { locale: enUS, weekStartsOn: 1 }) === 6) setHeight('340px');
    else setHeight('300px');
  }, []);

  const handleClickAway = () => {
    if (open) setOpen(false);
  };

  useEffect(() => {
    if (value === null && open) setInnerValue(new Date());
  }, [value, open]);

  const viewProps = view === 'button' ? { field: ButtonField } : { textField: DatePickerInputField };

  const handleFormatSelected = (value) => {
    if (isNaN(Date.parse(value))) return '***';

    return format(value, longDateFormatLocale);
  };

  const handleValueChange = (value) => {
    setInnerValue(value);
    onChange && onChange(value);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ width: '100%' }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            slots={{
              ...viewProps,
              actionBar: () => (
                <Stack direction={'row'} justifyContent={'space-between'} p={'12px'}>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setOpen(false);
                      setValueTmp(value);
                      onChange && onChange(value);
                    }}
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    variant="main"
                    onClick={() => {
                      setValueTmp(innerValue);
                      setOpen(false);
                    }}
                  >
                    {t('save')}
                  </Button>
                </Stack>
              ),
              toolbar: () => (
                <Stack
                  direction={'column'}
                  sx={{
                    padding: '16px 12px 12px 24px',
                    borderBottom: '1px solid var(--accent-200)',
                  }}
                >
                  <Typography className="body-small-semibold" color={'var(--grey-400)'}>
                    {t('tr_selectDate')}
                  </Typography>
                  <Typography className="h2">{`${handleFormatSelected(innerValue)}`}</Typography>
                </Stack>
              ),
            }}
            open={open}
            minDate={limitYear ? subYears(startOfYear(new Date()), 6) : null}
            maxDate={limitYear ? addYears(startOfYear(new Date()), 8) : null}
            disablePast={disablePast}
            yearsPerRow={3}
            showDaysOutsideCurrentMonth={true}
            onMonthChange={changeHeight}
            onChange={handleValueChange}
            onOpen={() => setOpen(true)}
            slotProps={{
              textField: {
                onClick: () => setOpen(true),
                label: label,
                value: valueTmp,
              },
              field: { format: shortDateFormatLocale },
              popper: {
                sx: {
                  ...StyleDatePickerPopper,
                  '.MuiDateCalendar-viewTransitionContainer': {
                    overflow: 'hidden',
                    height: height,
                    minHeight: height,
                    transition: 'min-height 0.5s ease',
                  },
                  '.MuiYearCalendar-root': {
                    width: 'inherit',
                    minHeight: height,
                    height: height,
                  },
                  '.MuiDayCalendar-slideTransition': {
                    minHeight: height,
                    height: height,
                    overflowY: 'hidden',
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
        </LocalizationProvider>
      </Box>
    </ClickAwayListener>
  );
};

export default CPEDatePicker;
