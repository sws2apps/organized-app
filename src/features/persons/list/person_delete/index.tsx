import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import { DeletePersonConfirmType } from './index.types';

const DeletePersonConfirm = ({
  open,
  onClose,
  onConfirm,
}: DeletePersonConfirmType) => {
  const { t } = useAppTranslation();

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      <Typography className="h2">{t('tr_deletePerson')}</Typography>
      <Typography className="body-regular" color="var(--grey-400)">
        {t('tr_deletePersonConfirmation')}
      </Typography>
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
