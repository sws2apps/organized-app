import { DesktopTimePicker, renderTimeViewClock } from '@mui/x-date-pickers';
import { Box, ClickAwayListener, useMediaQuery } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { CustomTimePickerProps } from './index.types';
import { StyleTimePickerPopper, StyleTimePickerToolbar } from './index.styles';
import { IconClock } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import InputTextField from './slots/textfield';
import ActionBar from './slots/actionbar';

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
  const divRef = useRef<HTMLDivElement>(null);

  const { t } = useAppTranslation();

  const [valueTmp, setValueTmp] = useState(value);
  const [open, setOpen] = useState<boolean>(false);

  const isMobile = useMediaQuery('(max-width:600px)');

  const handleClickAway = () => {
    if (open) setOpen(false);
  };

  const handleValueChange = (value: Date) => {
    setValueTmp(value);
  };

  const handleSave = () => {
    onChange?.(valueTmp);
    setOpen(false);
  };

  const handleClear = () => {
    setValueTmp(null);
    onChange?.(null);
    setOpen(false);
  };

  useEffect(() => {
    setValueTmp(value);
  }, [value]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box
        ref={divRef}
        sx={{ flex: 1, minWidth: '120px', width: '100%', ...sx }}
      >
        <DesktopTimePicker
          key={value ? value.toISOString() : crypto.randomUUID()}
          readOnly={readOnly}
          localeText={{ toolbarTitle: t('tr_pickerSelectTime') }}
          open={!readOnly && open}
          label={label}
          views={['hours', 'minutes']}
          orientation={isMobile ? 'portrait' : 'landscape'}
          value={valueTmp}
          ampm={ampm}
          onChange={handleValueChange}
          onOpen={() => setOpen(true)}
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
          }}
          slots={{
            textField: InputTextField,
            openPickerIcon: IconClock,
            actionBar: () => (
              <ActionBar onClear={handleClear} onClose={handleSave} />
            ),
          }}
          slotProps={{
            textField: {
              label: label,
              sx: {
                ...sx,
              },
              value: valueTmp,
              onClick: () => setOpen(!open),
            },
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
              anchorEl: divRef.current,
              sx: {
                ...StyleTimePickerPopper,
                '.MuiPickersToolbar-content': {
                  flexWrap: isMobile ? 'nowrap' : 'wrap',
                  alignItems: ampm ? 'flex-start' : 'center',
                  minWidth: '216px',
                },
                '.MuiPickersLayout-contentWrapper': {
                  marginTop: isMobile ? '5px' : '40px',
                  gridColumn: '2 / 2',
                },
                '.MuiTimeClock-arrowSwitcher': {
                  top: 0,
                  right: 0,
                },
                '.MuiPickersArrowSwitcher-button': {
                  color: 'var(--accent-150)',
                },
                '.MuiPickersArrowSwitcher-button:hover': {
                  backgroundColor: 'var(--accent-150)',
                  color: 'var(--accent-main)',
                },
                '.MuiIconButton-root': {
                  color: 'var(--accent-350)',
                },
                '.Mui-disabled': {
                  color: 'var(--accent-200)',
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
