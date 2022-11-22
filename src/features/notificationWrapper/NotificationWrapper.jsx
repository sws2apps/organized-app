import { useRecoilState, useRecoilValue } from 'recoil';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';

const NotificationWrapper = () => {
  const [appSnackOpen, setAppSnackOpen] = useRecoilState(appSnackOpenState);
  const appSeverity = useRecoilValue(appSeverityState);
  const appMessage = useRecoilValue(appMessageState);

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
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert variant="filled" onClose={handleClose} severity={appSeverity}>
            {appMessage}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default NotificationWrapper;
