import { enUS } from 'date-fns/locale';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useCallback, useEffect, useState } from 'react';
import { addYears, getWeeksInMonth, startOfYear, subYears } from 'date-fns';
import Stack from '@mui/material/Stack';
import { format } from 'date-fns';
import { ClickAwayListener } from '@mui/material';
import { Button, Typography } from '@components';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import '../../global.css';
import React from '@services/react';
import ButtonField from './view/button';
import { CPEDatePickerProps } from './date_picker.types';
import DatePickerInputField from './view/input';
import {
  StyleDatePickerActionBar,
  StyleDatePickerDay,
  StyleDatePickerDesktopPaper,
  StyleDatePickerLayout,
  StyleDatePickerPopper,
  StyleDatePickerToolbar,
} from './date_picker.style';
import { useTranslation } from 'react-i18next';

const CPEDatePicker = ({
  initDate = null,
  view,
  label,
  disablePast,
  limitYear = false,
  buttonViewFormat = 'dd MMM yyyy',
  toolbarInputViewFormat = 'EEE, dd MMM yyyy',
}: CPEDatePickerProps) => {
  const { t } = useTranslation('ui');
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<Date | null>(null);
  const [innerValue, setInnerValue] = useState<Date | null>(initDate);

  const [height, setHeight] = useState('300px'); // Initial height

  const changeHeight = useCallback((event) => {
    if (getWeeksInMonth(new Date(event), { locale: enUS, weekStartsOn: 1 }) === 6) setHeight('340px');
    else setHeight('300px');
  }, []);

  const handleClickAway = () => {
    if (open) setOpen(false);
  };

  useEffect(() => {
    if (initDate === null && open) setInnerValue(new Date());
  }, [initDate, open]);

  const viewProps = view === 'button' ? { field: ButtonField } : { textField: DatePickerInputField };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enUS}>
          <DesktopDatePicker
            slots={{
              ...viewProps,
              actionBar: () => (
                <Stack direction={'row'} justifyContent={'space-between'} p={'12px'}>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setOpen(false);
                      setValue(initDate);
                    }}
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    variant="main"
                    onClick={() => {
                      setValue(innerValue);
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
                    Select date
                  </Typography>
                  <Typography className="h2">{`${format(innerValue, toolbarInputViewFormat)}`}</Typography>
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
            onChange={setInnerValue}
            onOpen={() => setOpen(true)}
            slotProps={{
              textField: {
                setOpen: setOpen as never,
                label: label,
                value: value,
              } as never,
              field: {
                setOpen,
                formatView: buttonViewFormat,
              } as never,
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
      </div>
    </ClickAwayListener>
  );
};

export default CPEDatePicker;
