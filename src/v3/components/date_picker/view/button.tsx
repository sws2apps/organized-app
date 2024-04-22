import { BaseSingleInputFieldProps, FieldSection } from '@mui/x-date-pickers';
import { IconDate } from '@icons/index';
import { format } from 'date-fns';
import { Button } from '@mui/material';
import { Dispatch, FC, SetStateAction } from 'react';

interface ButtonFieldProps extends BaseSingleInputFieldProps<never, never, FieldSection, never> {
  setOpen?: Dispatch<SetStateAction<boolean>>;
  formatView: string;
}

/**
 * Component for rendering a button field in a date picker.
 * @param {ButtonFieldProps} props - Props for the ButtonField component.
 * @param {Dispatch<SetStateAction<boolean>>} props.setOpen - Function to set the open state of the date picker.
 * @param {string} props.id - The ID of the button.
 * @param {Date} props.value - The selected date value.
 * @param {boolean} props.disabled - Whether the button is disabled.
 * @param {Ref<unknown>} props.InputProps.ref - Reference to the input element.
 * @param {string} props.inputProps ['aria-label'] - Aria label for accessibility.
 * @param {string} props.formatView - Format string for displaying the date.
 * @returns {JSX.Element} ButtonField component.
 */
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
