import { Box, TextFieldProps } from '@mui/material';
import React from '@services/react';
import { TextField } from '@components';
import { StyledIconWrapper } from '../../user_card/user_card.styles';
import { IconDate } from '@icons';

const DatePickerInputField = (props: TextFieldProps & { setOpen?: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <TextField
      {...props}
      className={'body-regular'}
      endIcon={
        <StyledIconWrapper hoverBackgrColor="var(--accent-350-base)" iconColor="var(--accent-350)">
          <Box onClick={() => props.setOpen && props.setOpen((prev) => !prev)}>
            <IconDate />
          </Box>
        </StyledIconWrapper>
      }
    />
  );
};

export default DatePickerInputField;
