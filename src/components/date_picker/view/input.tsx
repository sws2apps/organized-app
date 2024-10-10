import { Dispatch, forwardRef, Ref, SetStateAction } from 'react';
import { TextFieldProps } from '@mui/material';
import TextField from '@components/textfield';
import { IconDate } from '@icons/index';
import { StyledIconWrapper } from '../date_picker.styles';

type DateTextFieldProps = TextFieldProps & {
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

/**
 * Component for the input field of a date picker.
 * @param {TextFieldProps & { setOpen?: Dispatch<SetStateAction<boolean>> }} props - Props for the DatePickerInputField component.
 * @param {Dispatch<SetStateAction<boolean>>} props.setOpen - Function to set the open state of the date picker.
 * @returns {JSX.Element} DatePickerInputField component.
 */
const DatePickerInputField = forwardRef(function DatePickerInputField(
  props: DateTextFieldProps,
  ref: Ref<HTMLInputElement>
) {
  const { setOpen, ...defaultProps } = props;

  const handleClick = () => {
    if (setOpen) setOpen((prev) => !prev);
  };

  return (
    <TextField
      ref={ref}
      {...defaultProps}
      className={'body-regular'}
      height={48}
      value={props.value}
      endIcon={
        <StyledIconWrapper onClick={handleClick}>
          <IconDate />
        </StyledIconWrapper>
      }
    />
  );
});

export default DatePickerInputField;
