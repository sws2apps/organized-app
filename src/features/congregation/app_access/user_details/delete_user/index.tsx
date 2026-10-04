import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import { DeleteUserType } from './index.types';
import useDeleteUser from './useDeleteUser';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import Markup from '@components/text_markup';

const DeleteUser = ({ open, onClose, user }: DeleteUserType) => {
  const { t } = useAppTranslation();

  const { isProcessing, handleDeleteUser } = useDeleteUser(user, onClose);

  return (
    <Dialog onClose={onClose} open={open} title={t('tr_deleteUserProfile')}>
      <Markup
        className="body-regular"
        color="var(--grey-400)"
        content={t('tr_deleteUserProfileDesc')}
      />

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button
          variant="main"
          color="red"
          disabled={isProcessing}
          endIcon={isProcessing && <IconLoading />}
          onClick={handleDeleteUser}
        >
          {t('tr_delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUser;
