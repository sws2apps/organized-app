import { useEffect, useState } from 'react';
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
} from './date_picker.styles';
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

  const [height, setHeight] = useState<number>(240); // Initial height

  useEffect(() => {
    if (getWeeksInMonth(new Date(), { locale: enUS, weekStartsOn: 0 }) === 6) setHeight(290);
  }, []);

  const changeHeight = (event) => {
    if (getWeeksInMonth(new Date(event), { locale: enUS, weekStartsOn: 0 }) === 6) setHeight(290);
    else setHeight(240);
  };

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
                <Stack direction={'row'} justifyContent={'space-between'} p={'12px'} gap={'12px'}>
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
                setOpen,
                label: label,
                value: valueTmp,
              } as never,
              field: {
                value: valueTmp,
                formatView: shortDateFormatLocale,
                setOpen,
              } as never,
              popper: {
                sx: {
                  ...StyleDatePickerPopper,
                  '.MuiDateCalendar-viewTransitionContainer': {
                    overflow: 'hidden',
                    // height: 'auto',
                    // height: height,
                    // minHeight: height,
                    // height: height,
                    // transition: 'min-height 0.5s ease',
                  },
                  '.MuiYearCalendar-root': {
                    // width: 'inherit',
                    // height: 'auto',
                    // minHeight: 'unset',
                    // minHeight: height,
                    // height: height,
                  },
                  '.MuiDayCalendar-slideTransition': {
                    minHeight: `${height}px`,
                    // height: height,
                    // height: 'auto',
                    // minHeight: 'auto',
                    // overflowY: 'hidden',
                    // transition: 'min-height 0.5s ease',
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
        </LocalizationProvider>
      </Box>
    </ClickAwayListener>
  );
};

export default CPEDatePicker;
