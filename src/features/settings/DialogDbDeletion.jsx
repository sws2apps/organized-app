import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { deleteDb } from '../../indexedDb/dbUtility';
import { isDeleteDbOpenState } from '../../states/main';

const DialogDbDeletion = () => {
  const { t } = useTranslation('ui');

  const [open, setOpen] = useRecoilState(isDeleteDbOpenState);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    await deleteDb();
    window.location.href = './';
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t('deleteDbTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{t('deleteDbDesc')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t('cancel')}
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            {t('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DialogDbDeletion;
