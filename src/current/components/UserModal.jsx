import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

const UserModal = ({ fullScreen, title, children, open, setOpen, isProcessing, action }) => {
  const { t } = useTranslation();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-close-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {fullScreen && (
            <img
              src="./img/appLogo.png"
              alt="App Logo"
              style={{
                width: 'auto',
                height: '30px',
                borderRadius: '4px',
              }}
            />
          )}

          <Typography sx={{ lineHeight: 1.3, fontSize: fullScreen ? '16px' : '20px' }}>{title}</Typography>
        </DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button disabled={isProcessing} onClick={handleClose}>
            {t('no')}
          </Button>
          <Button
            disabled={isProcessing}
            onClick={action}
            endIcon={isProcessing ? <CircularProgress size={25} /> : null}
          >
            {t('yes')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserModal;
