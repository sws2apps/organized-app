import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { rootModalOpenState } from '../states/main';

const RootModal = ({ children }) => {
  const { t } = useTranslation('ui');

  const [open, setOpen] = useRecoilState(rootModalOpenState);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway' || reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Box>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-close-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-close-title">{t('pleaseWait')}</DialogTitle>
          <DialogContent>
            <CircularProgress
              color="secondary"
              size={80}
              disableShrink={true}
              sx={{
                display: 'flex',
                margin: '10px auto',
              }}
            />
          </DialogContent>
        </Dialog>
      </Box>
      {children}
    </>
  );
};

export default RootModal;
