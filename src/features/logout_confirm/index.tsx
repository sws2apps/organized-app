import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import Typography from '@components/typography';

const LogoutConfirm = ({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: VoidFunction;
  onConfirm: VoidFunction;
}) => {
  const { t } = useAppTranslation();

  return (
    <Dialog open={open} onClose={onClose} title={t('tr_logoutConfirmTitle')}>
      <Typography className="body-regular" color="var(--grey-400)">
        {t('tr_logoutConfirmDesc')}
      </Typography>
      <Typography className="body-regular" color="var(--grey-400)">
        {t('tr_logoutConfirmHint')}
      </Typography>
      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" onClick={onConfirm}>
          {t('tr_logoutKeepData')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutConfirm;
