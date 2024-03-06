import { Dispatch, SetStateAction, useCallback } from 'react';
import { TextFieldProps } from '@mui/material';
import TextField from '@components/textfield';
import { IconDate } from '@icons/index';
import { StyledIconWrapper } from '../date_picker.styles';

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
