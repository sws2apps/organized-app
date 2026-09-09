import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { useAppTranslation } from '@hooks/index';
import { ThemeChangeConfirmType } from './index.types';

const ThemeChangeConfirm = ({
  open,
  onClose,
  onConfirm,
}: ThemeChangeConfirmType) => {
  const { t } = useAppTranslation();

  return (
    <Dialog
      onClose={onClose}
      open={open}
      title={t('tr_themeFollowOSDisable')}
      description={t('tr_themeFollowOSDisableDesc')}
    >
      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" onClick={onConfirm}>
          {t('tr_yes')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ThemeChangeConfirm;
