import { Dispatch, SetStateAction } from 'react';
import { TextFieldProps } from '@mui/material';
import TextField from '@components/textfield';
import { IconDate } from '@icons/index';
import { StyledIconWrapper } from '../date_picker.styles';

const DatePickerInputField = (props: TextFieldProps & { setOpen?: Dispatch<SetStateAction<boolean>> }) => {
  return (
    <TextField
      {...props}
      className={'body-regular'}
      height={48}
      endIcon={
        <StyledIconWrapper onClick={() => props.setOpen && props.setOpen((prev) => !prev)}>
          <IconDate />
        </StyledIconWrapper>
      }
    />
  );
};

export default DatePickerInputField;
