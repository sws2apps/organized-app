import { Box } from '@mui/material';
import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import { DeleteUserType } from './index.types';
import useDeleteUser from './useDeleteUser';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Typography from '@components/typography';
import Markup from '@components/text_markup';

const DeleteUser = ({ open, onClose, user }: DeleteUserType) => {
  const { t } = useAppTranslation();

  const { isProcessing, handleDeleteUser } = useDeleteUser(user, onClose);

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography className="h3">{t('tr_deleteUserProfile')}</Typography>

        <Markup
          className="body-regular"
          color="var(--grey-400)"
          content={t('tr_deleteUserProfileDesc')}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
        }}
      >
        <Button
          variant="main"
          color="red"
          disabled={isProcessing}
          endIcon={isProcessing && <IconLoading />}
          onClick={handleDeleteUser}
        >
          {t('tr_delete')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default DeleteUser;
