import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { useAppTranslation } from '@hooks/index';
import { PersonDisqualifyConfirmType } from './index.types';

const PersonDisqualifyConfirm = ({
  open,
  onClose,
  onConfirm,
}: PersonDisqualifyConfirmType) => {
  const { t } = useAppTranslation();

  return (
    <Dialog
      onClose={onClose}
      open={open}
      title={t('tr_markDisqualifiedTitle')}
      description={t('tr_markDisqualifiedDesc')}
    >
      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" onClick={onConfirm} color="red">
          {t('tr_disqualify')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PersonDisqualifyConfirm;
