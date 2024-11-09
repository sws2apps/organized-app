import {
  Badge,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import useMfaVerify from './useMfaVerify';

const MfaVerify = () => {
  const { tabletUp, inputRef, handleVerifyMfa, isProcessing, tokenDev } =
    useMfaVerify();

  return (
    <Box
      sx={{
        margin: '10px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '15px',
        maxWidth: '320px',
      }}
    >
      <TextField
        size="small"
        label="Enter 2FA code"
        fullWidth
        inputRef={inputRef}
      />

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
          variant="contained"
          onClick={handleVerifyMfa}
          fullWidth={tabletUp ? false : true}
          endIcon={
            isProcessing ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          Verify
        </Button>
      </Box>

      {tokenDev && (
        <Box sx={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
          <Badge badgeContent="dev" color="error" />
          <Box>
            <Typography>Use this code to verify {tokenDev}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MfaVerify;
