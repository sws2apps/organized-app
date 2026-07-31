import { DesktopTimePicker, renderTimeViewClock } from '@mui/x-date-pickers';
import { Box, ClickAwayListener, useMediaQuery } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { CustomTimePickerProps } from './index.types';
import {
  getTimePickerPopperStyle,
  getTimePickerToolbarStyle,
} from './index.styles';
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
  hideIcon = false,
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
              value: valueTmp,
              onClick: () => setOpen(!open),
              sx: hideIcon
                ? { '.MuiInputAdornment-root': { display: 'none' } }
                : undefined,
            },
            toolbar: {
              hidden: false,
              className: 'h3',
              sx: getTimePickerToolbarStyle(isMobile, ampm),
            },
            desktopPaper: {
              className: 'pop-up pop-up-shadow',
            },
            popper: {
              anchorEl: divRef.current,
              sx: getTimePickerPopperStyle(isMobile, ampm),
            },
          }}
        />
      </Box>
    </ClickAwayListener>
  );
};

export default TimePicker;
