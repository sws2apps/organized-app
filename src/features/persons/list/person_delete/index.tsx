import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { useAppTranslation } from '@hooks/index';
import { DeletePersonConfirmType } from './index.types';

const DeletePersonConfirm = ({
  open,
  onClose,
  onConfirm,
}: DeletePersonConfirmType) => {
  const { t } = useAppTranslation();

  return (
    <Dialog
      onClose={onClose}
      open={open}
      title={t('tr_deletePerson')}
      description={t('tr_deletePersonConfirmation')}
    >
      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" onClick={onConfirm} color="red">
          {t('tr_delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePersonConfirm;
