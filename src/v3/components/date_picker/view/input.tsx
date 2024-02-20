import { Dispatch } from 'react';
import { Box, TextFieldProps } from '@mui/material';
import TextField from '@components/textfield';
import { IconDate } from '@icons/index';
import { StyledIconWrapper } from '../date_picker.style';

const DatePickerInputField = (props: TextFieldProps & { setOpen?: Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <TextField
      {...props}
      className={'body-regular'}
      height={48}
      endIcon={
        <StyledIconWrapper>
          <Box onClick={() => props.setOpen && props.setOpen((prev) => !prev)}>
            <IconDate />
          </Box>
        </StyledIconWrapper>
      }
    />
  );
};

export default DatePickerInputField;
