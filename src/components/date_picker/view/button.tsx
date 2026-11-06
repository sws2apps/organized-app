import { useMemo } from 'react';
import { Button } from '@mui/material';
import {
  DatePickerFieldProps,
  usePickerContext,
  useSplitFieldProps,
} from '@mui/x-date-pickers';
import { IconDate } from '@icons/index';
import { formatDate } from '@utils/date';
import { useAppTranslation } from '@hooks/index';

const ButtonField = (props: DatePickerFieldProps) => {
  const { t } = useAppTranslation();

  const { forwardedProps } = useSplitFieldProps(props, 'date');

  const {
    enableAccessibleFieldDOMStructure: _enableAccessibleFieldDOMStructure,
    clearable: _clearable,
    onClear: _onClear,
    customInput: _customInput,
    slotProps: _slotProps,
    inputRef: _inputRef,
    ...buttonProps
  } = forwardedProps as typeof forwardedProps & {
    enableAccessibleFieldDOMStructure?: boolean;
    clearable?: boolean;
    onClear?: () => void;
    customInput?: unknown;
    slotProps?: unknown;
    inputRef?: unknown;
  };

  const pickerContext = usePickerContext();

  const value = useMemo(() => {
    const tmpValue = pickerContext.value;

    if (!tmpValue) return t('tr_pickerSelectDate');

    return formatDate(tmpValue, pickerContext.fieldFormat ?? 'M/d/yyyy');
  }, [pickerContext.value, pickerContext.fieldFormat, t]);

  return (
    <Button
      {...buttonProps}
      ref={pickerContext.triggerRef}
      aria-haspopup="dialog"
      aria-expanded={pickerContext.open}
      variant="text"
      onClick={() => pickerContext.setOpen((prev) => !prev)}
      endIcon={<IconDate color={'var(--accent-dark)'} />}
      sx={{
        textTransform: 'unset',
        color: 'var(--accent-dark)',
        borderRadius: 'var(--radius-l)',
        ':hover': {
          backgroundColor: 'rgba(var(--accent-main-base), 0.1)',
        },
        padding: '4px 8px',
      }}
    >
      {value}
    </Button>
  );
};

export default ButtonField;
