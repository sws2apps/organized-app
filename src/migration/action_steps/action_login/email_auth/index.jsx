import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import useEmailAuth from './useEmailAuth';

const EmailAuth = () => {
  const {
    tabletUp,
    inputRef,
    handleBack,
    handleSendLink,
    isProcessing,
    linkDev,
  } = useEmailAuth();

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
        label="Enter your email"
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
          variant="outlined"
          onClick={handleBack}
          fullWidth={tabletUp ? false : true}
          disabled={isProcessing}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleSendLink}
          fullWidth={tabletUp ? false : true}
          endIcon={
            isProcessing ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          Send link
        </Button>
      </Box>

      {linkDev && (
        <Box sx={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
          <Badge badgeContent="dev" color="error" />
          <Box>
            <Typography>
              Click{' '}
              <Link href={linkDev} underline="none">
                here
              </Link>{' '}
              to continue
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default EmailAuth;
