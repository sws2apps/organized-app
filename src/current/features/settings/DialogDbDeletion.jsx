import { getAuth, signOut } from 'firebase/auth';
import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { deleteAppDb } from '../../indexedDb/dbUtility';
import { isDeleteDbOpenState } from '../../states/main';
import { Setting } from '../../classes/Setting';

const DialogDbDeletion = () => {
  const { t } = useTranslation('ui');

  const [open, setOpen] = useRecoilState(isDeleteDbOpenState);

  const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');
  const secretaryRole = Setting.cong_role.includes('secretary');

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    const auth = await getAuth();

    await deleteAppDb();
    await signOut(auth);

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
          <DialogContentText id="alert-dialog-description">
            {lmmoRole || secretaryRole ? t('deleteDbDesc') : t('deleteDbNoRecordDesc')}
          </DialogContentText>
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
