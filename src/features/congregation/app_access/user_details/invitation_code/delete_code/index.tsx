import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { DeleteCodeType } from './index.types';
import useDeleteCode from './useDeleteCode';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Typography from '@components/typography';
import WaitingLoader from '@components/waiting_loader';

const DeleteCode = ({ open, onClose, user }: DeleteCodeType) => {
  const { t } = useAppTranslation();

  const { isProcessing, handleDeleteCode } = useDeleteCode(user, onClose);

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography className="h3">{t('tr_deleteInvitationCode')}</Typography>

        <Typography color="var(--grey-400)">
          {t('tr_deleteInvitationCodeDesc')}
        </Typography>
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
          endIcon={
            isProcessing && <WaitingLoader size={22} variant="standard" />
          }
          onClick={handleDeleteCode}
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

export default DeleteCode;
