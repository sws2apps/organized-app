import { useAppTranslation } from '@hooks/index';
import { QuickSettingsProps } from './index.types';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import Button from '@components/button';

const QuickSettings = ({
  open,
  onClose,
  title,
  children,
}: QuickSettingsProps) => {
  const { t } = useAppTranslation();

  return (
    <Dialog
      onClose={onClose}
      open={open}
      title={`${t('tr_quickSettings')} – ${title}`}
      description={t('tr_quickSettingsDesc')}
    >
      {children}

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" onClick={onClose}>
          {t('tr_done')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuickSettings;
