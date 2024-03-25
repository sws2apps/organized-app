import { FC } from 'react';
import { Box } from '@mui/material';
import { MuiOtpInput, MuiOtpInputProps } from 'mui-one-time-password-input';

const matchIsNumeric = (text) => {
  return !isNaN(Number(text));
};

const validateChar = (value) => {
  return matchIsNumeric(value);
};

type OTPInputProps = MuiOtpInputProps & {
  hasError?: boolean;
};

const OTPInput: FC<OTPInputProps> = ({ hasError, ...props }) => {
  return (
    <Box sx={{ width: '100%', maxWidth: '352px' }}>
      <MuiOtpInput
        {...props}
        length={6}
        display="flex"
        gap={1}
        validateChar={validateChar}
        TextFieldsProps={(index) => ({
          autoComplete: 'off',
          inputProps: {
            className: 'h1',
          },
          sx: {
            '.MuiOutlinedInput-input': {
              color: 'var(--black)',
              width: 52,
              height: 52,
              padding: 0,
              borderRadius: 'var(--radius-l)',
            },
            '.MuiOutlinedInput-root': {
              '& fieldset': {
                border: `1px solid var(${hasError ? '--red-dark' : props.value[index]?.length > 0 ? '--accent-main' : '--accent-300'})`,
              },
              '&.Mui-focused fieldset': {
                border: `1px solid var(${hasError ? '--red-dark' : '--accent-main'})`,
              },
              '&:hover fieldset': {
                border: `1px solid var(${hasError ? '--red-dark' : '--accent-main'})`,
              },
            },
          },
        })}
        sx={{}}
      />
    </Box>
  );
};

export default OTPInput;
