import { BaseSingleInputFieldProps, FieldSection } from '@mui/x-date-pickers';
import { IconDate } from '@icons/index';
import { format } from 'date-fns';
import { Button } from '@mui/material';
import { Dispatch, FC, SetStateAction } from 'react';

interface ButtonFieldProps extends BaseSingleInputFieldProps<never, never, FieldSection, never> {
  setOpen?: Dispatch<SetStateAction<boolean>>;
  formatView: string;
}

const ButtonField: FC<ButtonFieldProps> = ({
  setOpen,
  id,
  value,
  disabled,
  InputProps: { ref } = {},
  inputProps: { 'aria-label': ariaLabel } = {},
  formatView,
}) => {
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
