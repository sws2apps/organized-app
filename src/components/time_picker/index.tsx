import {
  DesktopTimePicker,
  PickersActionBarProps,
  renderTimeViewClock,
} from '@mui/x-date-pickers';
import {
  Box,
  ClickAwayListener,
  Stack,
  TextFieldProps,
  useMediaQuery,
} from '@mui/material';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CustomTimePickerProps } from './time_picker.types';
import {
  StyleTimePickerPopper,
  StyleTimePickerToolbar,
} from './time_picker.styles';
import { IconClock } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import TextField from '@components/textfield';
import Button from '@components/button';

/**
 * Custom input field for the time picker.
 *
 * @param props The props for the TimePickerInputField component.
 * @param props.setOpen Function to set the open state of the time picker.
 */
const TimePickerInputField = (
  props: TextFieldProps & { setOpen?: Dispatch<SetStateAction<boolean>> }
) => {
  const handleClick = useCallback(() => {
    if (props.setOpen) props.setOpen((prev) => !prev);
  }, [props]);

  return (
    <TextField
      {...props}
      className="body-regular"
      endIcon={
        <Box
          onClick={handleClick}
          display={'flex'}
          alignItems={'center'}
          style={{ cursor: 'pointer' }}
        >
          <IconClock />
        </Box>
      }
    />
  );
};

/**
 * Custom action bar for the time picker.
 *
 * @param props The props for the TimePickerActionBar component.
 * @param props.onSave Function to handle save action.
 * @param props.onClear Function to handle clear action.
 */
const TimePickerActionBar = (
  props: PickersActionBarProps & { onClear: VoidFunction; onSave: VoidFunction }
) => {
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
        {t('tr_clear')}
      </Button>
      <Button variant="main" onClick={onSave}>
        {t('tr_save')}
      </Button>
    </Stack>
  );
};

/**
 * Custom time picker component.
 *
 * @param props The props for the CustomTimePicker component.
 * @param props.ampm Whether to use AM/PM format.
 * @param props.label The label for the time picker.
 * @param props.value The value of the time picker.
 * @param props.onChange Function to handle value change.
 */
const TimePicker = ({
  ampm,
  label,
  value = null,
  onChange,
  sx,
  readOnly = false,
}: CustomTimePickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { t } = useAppTranslation();

  const [currentValue, setCurrentValue] = useState(value);
  const [innerValue, setInnerValue] = useState(value);
  const [open, setOpen] = useState<boolean>(false);

  const isMobile = useMediaQuery('(max-width:600px)');

  const handleClickAway = () => {
    if (open) setOpen(false);
  };

  const handleValueChange = (value: Date) => {
    setInnerValue(value);
  };

  const handleSave = () => {
    setCurrentValue(innerValue);
    onChange?.(innerValue);
    setOpen(false);
  };

  const handleClear = () => {
    setCurrentValue(null);
    setInnerValue(null);
    onChange?.(null);
    setOpen(false);
  };

  useEffect(() => {
    setInnerValue(value);
    setCurrentValue(value);
  }, [value]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ flex: 1, minWidth: '120px', width: '100%', ...sx }}>
        <DesktopTimePicker
          key={value ? value.toISOString() : crypto.randomUUID()}
          readOnly={readOnly}
          localeText={{ toolbarTitle: t('tr_pickerSelectTime') }}
          open={!readOnly && open}
          label={label}
          views={['hours', 'minutes']}
          orientation={isMobile ? 'portrait' : 'landscape'}
          value={innerValue}
          ampm={ampm}
          onChange={handleValueChange}
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
              onSave: handleSave,
              onClear: handleClear,
            } as never,
            textField: {
              inputRef,
              label: label,
              value: currentValue,
              onClick: () => setOpen(!open),
            } as never,
            toolbar: {
              hidden: false,
              className: 'h3',
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
              anchorEl: inputRef.current,
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
      </Box>
    </ClickAwayListener>
  );
};

export default TimePicker;
