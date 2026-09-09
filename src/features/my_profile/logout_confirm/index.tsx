import { LogoutConfirmType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useLogoutConfirm from './useLogoutConfirm';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';

const LogoutConfirm = ({ open, onClose }: LogoutConfirmType) => {
  const { t } = useAppTranslation();

  const { handleLogout } = useLogoutConfirm();

  return (
    <Dialog
      onClose={onClose}
      open={open}
      title={t('tr_logoutClearData')}
      description={t('tr_logoutClearDataDesc')}
    >
      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" color="red" onClick={handleLogout}>
          {t('tr_logOut')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutConfirm;
