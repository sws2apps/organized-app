import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { useAppTranslation } from '@hooks/index';
import { PersonQualifyConfirmType } from './index.types';

const PersonQualifyConfirm = ({
  open,
  onClose,
  onConfirm,
}: PersonQualifyConfirmType) => {
  const { t } = useAppTranslation();

  return (
    <Dialog
      onClose={onClose}
      open={open}
      title={t('tr_markQualifiedTitle')}
      description={t('tr_markQualifiedDesc')}
    >
      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" onClick={onConfirm}>
          {t('tr_qualifyAgain')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PersonQualifyConfirm;
