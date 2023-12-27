import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useModal from './useModal';
import { useAppTranslation } from '@hooks';

const AppModalWrapper = ({ children }) => {
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
          <DialogTitle id="alert-dialog-close-title">{t('trans_pleaseWait')}</DialogTitle>
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

AppModalWrapper.propTypes = {
  children: PropTypes.node,
};

export default AppModalWrapper;
