import { DeleteConfirmType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import Typography from '@components/typography';

const DeleteConfirm = ({
  open,
  title,
  description,
  onCancel,
  onConfirm,
}: DeleteConfirmType) => {
  const { t } = useAppTranslation();

  return (
    <Dialog
      onClose={onCancel}
      open={open}
      sx={{ padding: '24px', gap: '16px' }}
    >
      <Typography className="h2">{title}</Typography>
      <Typography className="body-regular" color="var(--grey-400)">
        {description}
      </Typography>

      <DialogActions>
        <Button variant="secondary" onClick={onCancel}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" color="red" onClick={onConfirm}>
          {t('tr_delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirm;
