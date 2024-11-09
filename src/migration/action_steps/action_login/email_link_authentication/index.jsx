import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import useEmailLinkAuthentication from './useEmailLinkAuthentication';

const EmailLinkAuthentication = () => {
  const { tabletUp, handleBack, handleLogin, isAuthProcessing } =
    useEmailLinkAuthentication();

  return (
    <Stack spacing="8px">
      <Typography>
        Click the Login button below to complete your authentication.
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexDirection: tabletUp ? 'row' : 'column-reverse',
          width: '100%',
        }}
      >
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={isAuthProcessing}
          fullWidth={tabletUp ? false : true}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleLogin}
          fullWidth={tabletUp ? false : true}
          endIcon={
            isAuthProcessing ? (
              <CircularProgress size={16} color="inherit" />
            ) : null
          }
        >
          Login
        </Button>
      </Box>
    </Stack>
  );
};

export default EmailLinkAuthentication;
