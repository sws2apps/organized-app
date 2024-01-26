import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useModal from './useModal';
import { useAppTranslation } from '@hooks/index';

const AppModalWrapper = ({ children }: { children: ReactNode }) => {
  const { handleClose, open } = useModal();

  const { t } = useAppTranslation();

  return (
    <>
      <Box>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-close-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-close-title">{t('tr_pleaseWait')}</DialogTitle>
          <DialogContent>
            <CircularProgress
              color="secondary"
              size={80}
              disableShrink={true}
              sx={{ display: 'flex', margin: '10px auto' }}
            />
          </DialogContent>
        </Dialog>
      </Box>
      {children}
    </>
  );
};

export default AppModalWrapper;
