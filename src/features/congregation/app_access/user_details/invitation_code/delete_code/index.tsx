import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import { DeleteCodeType } from './index.types';
import useDeleteCode from './useDeleteCode';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';

const DeleteCode = ({ open, onClose, user }: DeleteCodeType) => {
  const { t } = useAppTranslation();

  const { isProcessing, handleDeleteCode } = useDeleteCode(user, onClose);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      title={t('tr_deleteInvitationCode')}
      description={t('tr_deleteInvitationCodeDesc')}
    >
      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button
          variant="main"
          color="red"
          disabled={isProcessing}
          endIcon={isProcessing && <IconLoading />}
          onClick={handleDeleteCode}
        >
          {t('tr_delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCode;
