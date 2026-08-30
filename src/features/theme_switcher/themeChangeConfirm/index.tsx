import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import { ThemeChangeConfirmType } from './index.types';

const ThemeChangeConfirm = ({
  open,
  onClose,
  onConfirm,
}: ThemeChangeConfirmType) => {
  const { t } = useAppTranslation();

  return (
    <Dialog onClose={onClose} open={open}>
      <Typography className="h2">{t('tr_themeFollowOSDisable')}</Typography>
      <Typography className="body-regular" color="var(--grey-400)">
        {t('tr_themeFollowOSDisableDesc')}
      </Typography>
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
