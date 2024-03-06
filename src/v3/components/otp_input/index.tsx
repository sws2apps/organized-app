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
        TextFieldsProps={{
          InputProps: { className: 'h1' },
          autoComplete: 'off',
        }}
        sx={{
          '.MuiOutlinedInput-input': {
            width: 52,
            height: 52,
            padding: 0,
            borderRadius: 'var(--radius-l)',
            border: `1px solid var(${hasError ? '--red-dark' : '--accent-main'})`,
          },
        }}
      />
    </Box>
  );
};

export default OTPInput;
