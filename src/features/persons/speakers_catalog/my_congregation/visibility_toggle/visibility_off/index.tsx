import { VisibilityOffConfirmType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import TextMarkup from '@components/text_markup';

const VisibilityOffConfirm = ({
  open,
  onClose,
  onConfirm,
}: VisibilityOffConfirmType) => {
  const { t } = useAppTranslation();

  return (
    <Dialog onClose={onClose} open={open} title={t('tr_outgoingSpeakersHide')}>
      <TextMarkup
        className="body-regular"
        color="var(--grey-400)"
        content={t('tr_outgoingSpeakersHideDesc')}
      />
      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" onClick={onConfirm}>
          {t('tr_hide')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VisibilityOffConfirm;
