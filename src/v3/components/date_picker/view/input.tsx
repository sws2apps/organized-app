import { Dispatch, SetStateAction, useCallback } from 'react';
import { TextFieldProps } from '@mui/material';
import TextField from '@components/textfield';
import { IconDate } from '@icons/index';
import { StyledIconWrapper } from '../date_picker.styles';

/**
 * Component for the input field of a date picker.
 * @param {TextFieldProps & { setOpen?: Dispatch<SetStateAction<boolean>> }} props - Props for the DatePickerInputField component.
 * @param {Dispatch<SetStateAction<boolean>>} props.setOpen - Function to set the open state of the date picker.
 * @returns {JSX.Element} DatePickerInputField component.
 */
const DatePickerInputField = (props: TextFieldProps & { setOpen?: Dispatch<SetStateAction<boolean>> }) => {
  const handleClick = useCallback(() => {
    if (props.setOpen) props.setOpen((prev) => !prev);
  }, [props]);

  return (
    <TextField
      {...props}
      className={'body-regular'}
      height={48}
      endIcon={
        <StyledIconWrapper onClick={handleClick}>
          <IconDate />
        </StyledIconWrapper>
      }
    />
  );
};

export default DatePickerInputField;
