import { useRecoilState, useRecoilValue } from 'recoil';
import {
  appMessageCPEState,
  appSeverityCPEState,
  appSnackOpenCPEState,
} from '../states/main';
import { Alert, Snackbar } from '@mui/material';

const AppSnackBar = () => {
  const [appSnackOpen, setAppSnackOpen] = useRecoilState(appSnackOpenCPEState);

  const appSeverity = useRecoilValue(appSeverityCPEState);
  const appMessage = useRecoilValue(appMessageCPEState);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAppSnackOpen(false);
  };

  return (
    <>
      {appMessage && (
        <Snackbar
          open={appSnackOpen}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            variant="filled"
            onClose={handleClose}
            severity={appSeverity}
            sx={{ maxWidth: '500px' }}
          >
            {appMessage}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default AppSnackBar;
