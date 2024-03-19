import {
  DesktopTimePicker,
  LocalizationProvider,
  PickersActionBarProps,
  renderTimeViewClock,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box, ClickAwayListener, Stack, TextFieldProps, useMediaQuery } from '@mui/material';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { CPETimePickerProps } from './time_picker.types';
import { StyleTimePickerPopper, StyleTimePickerToolbar } from './time_picker.styles';
import { IconClock } from '@components/icons';
import TextField from '@components/textfield';
import Button from '@components/button';
import { useAppTranslation } from '@hooks/index';

const TimePickerInputField = (props: TextFieldProps & { setOpen?: Dispatch<SetStateAction<boolean>> }) => {
  const handleClick = useCallback(() => {
    if (props.setOpen) props.setOpen((prev) => !prev);
  }, [props]);

  return (
    <TextField
      {...props}
      className={'body-regular'}
      endIcon={
        <Box onClick={handleClick} display={'flex'} alignItems={'center'} style={{ cursor: 'pointer' }}>
          <IconClock />
        </Box>
      }
    />
  );
};

const TimePickerActionBar = (props: PickersActionBarProps & { onClear: VoidFunction; onSave: VoidFunction }) => {
  const { onSave, onClear } = props;
  const { t } = useAppTranslation();

  return (
    <Stack
      direction={'row'}
      justifyContent={'space-between'}
      p={'12px'}
      style={{
        gridRow: '3',
        gridColumn: '1 / 3',
      }}
    >
      <Button variant="secondary" onClick={onClear}>
        {t('tr_cancel')}
      </Button>
      <Button variant="main" onClick={onSave}>
        {t('tr_save')}
      </Button>
    </Stack>
  );
};

const CPETimePicker = ({ ampm, label, value = null, onChange, isValueOnOpen = false }: CPETimePickerProps) => {
  const { t } = useAppTranslation();
  const [currentValue, setCurrentValue] = useState<Date | null>(null);
  const [innerValue, setInnerValue] = useState<Date | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    if (value === null && isValueOnOpen && open && innerValue === null) {
      setCurrentValue(new Date());
      setInnerValue(new Date());
    }
  }, [value, open, isValueOnOpen, innerValue]);

  const handleClickAway = () => {
    if (open) setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopTimePicker
            localeText={{ toolbarTitle: t('tr_pickerSelectTime') }}
            open={open}
            label={label}
            views={['hours', 'minutes']}
            orientation={isMobile ? 'portrait' : 'landscape'}
            value={innerValue}
            ampm={ampm}
            onChange={(value) => {
              setInnerValue(value);
              if (onChange) onChange();
            }}
            onOpen={() => setOpen(true)}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
            }}
            slots={{
              textField: TimePickerInputField,
              actionBar: TimePickerActionBar,
            }}
            slotProps={{
              actionBar: {
                onSave: () => {
                  setCurrentValue(innerValue);
                  setOpen(false);
                },
                onClear: () => {
                  setOpen(false);
                  setCurrentValue(value);
                  setInnerValue(value);
                },
              } as never,
              textField: {
                setOpen: setOpen,
                label: label,
                value: currentValue,
                onClick: () => setOpen(!open),
              } as never,
              toolbar: {
                hidden: false,
                sx: {
                  ...StyleTimePickerToolbar,
                  maxWidth: isMobile ? 'none' : '250px',
                  '.MuiTimePickerToolbar-hourMinuteLabel': {
                    width: '100%',
                    height: isMobile ? '100%' : null,
                    marginTop: ampm ? 'auto' : 'unset',
                    span: {
                      color: 'var(--black)',
                      padding: '10px 0',
                    },
                  },
                  '.MuiTimePickerToolbar-ampmSelection': {
                    height: isMobile ? '100%' : null,
                    margin: isMobile ? null : '16px 0 auto',
                    '& > *:first-of-type': {
                      borderBottomLeftRadius: isMobile ? '0' : null,
                      borderBottomRightRadius: isMobile ? '0' : null,
                    },
                    '& > *:last-of-type': {
                      borderTop: isMobile ? '0' : null,
                      borderTopLeftRadius: isMobile ? '0' : null,
                      borderTopRightRadius: isMobile ? '0' : null,
                    },
                    button: {
                      border: '1px solid var(--accent-300)',
                      span: {
                        color: 'var(--accent-400)',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px',
                      },
                      minWidth: '52px',
                      height: '100%',
                    },
                  },
                },
              },
              desktopPaper: {
                className: 'pop-up pop-up-shadow',
              },
              popper: {
                sx: {
                  ...StyleTimePickerPopper,
                  '.MuiPickersToolbar-content': {
                    flexWrap: isMobile ? 'nowrap' : 'wrap',
                    alignItems: ampm ? 'flex-start' : 'center',
                    minWidth: '216px',
                  },
                  '.MuiPickersLayout-contentWrapper': {
                    marginTop: isMobile ? '5px' : '40px',
                  },
                },
              },
            }}
          />
        </LocalizationProvider>
      </div>
    </ClickAwayListener>
  );
};

export default CPETimePicker;
