import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import useAccessCode from './useAccessCode';
import PasswordField from '../password_field';

const AccessCode = () => {
  const {
    accessCodeConfirmRef,
    accessCodeRef,
    handleSetAccessCode,
    isProcessing,
  } = useAccessCode();

  return (
    <Stack spacing="16px">
      <Typography sx={{ fontWeight: 'bold' }}>
        Create congregation access code
      </Typography>
      <Typography>
        This is your congregation’s unique code for connecting new users and
        loggin in. It encrypts data and is required for accessing your
        congregation in the Organized app. Create a code that’s simple yet
        secure.
      </Typography>

      <PasswordField
        label="Create access code"
        inputRef={accessCodeRef}
        sx={{ marginTop: '24px !important' }}
      />
      <PasswordField
        label="Confirm access code"
        inputRef={accessCodeConfirmRef}
      />

      <Button
        variant="contained"
        onClick={handleSetAccessCode}
        endIcon={
          isProcessing ? <CircularProgress size={16} color="inherit" /> : null
        }
      >
        Set access code
      </Button>
    </Stack>
  );
};

export default AccessCode;
