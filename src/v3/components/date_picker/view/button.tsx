import React from '@services/react';
import { BaseSingleInputFieldProps, FieldSection } from '@mui/x-date-pickers';
import { IconDate } from '@icons';
import { format } from 'date-fns';
import { Button } from '@mui/material';
const ButtonField = ({
  setOpen,
  id,
  value,
  disabled,
  InputProps: { ref } = {},
  inputProps: { 'aria-label': ariaLabel } = {},
  formatView,
}: { setOpen?: React.Dispatch<React.SetStateAction<boolean>>; formatView: string } & BaseSingleInputFieldProps<
  any,
  any,
  FieldSection,
  any
>) => {
  return (
    <Button
      variant="text"
      id={id}
      disabled={disabled}
      ref={ref}
      aria-label={ariaLabel}
      onClick={() => setOpen?.((prev) => !prev)}
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
      {value ? `${format(value, formatView)}` : 'Pick a date'}
    </Button>
  );
};
export default ButtonField;
