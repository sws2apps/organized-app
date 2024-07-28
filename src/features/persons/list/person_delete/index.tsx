import { Box } from '@mui/material';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import { DeletePersonConfirmType } from './index.types';

const DeletePersonConfirm = ({
  open,
  onClose,
  onConfirm,
}: DeletePersonConfirmType) => {
  const { t } = useAppTranslation();

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      <Typography className="h2">{t('tr_deletePerson')}</Typography>
      <Typography className="body-regular" color="var(--grey-400)">
        {t('tr_deletePersonConfirmation')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
        }}
      >
        <Button variant="main" onClick={onConfirm} color="red">
          {t('tr_delete')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default DeletePersonConfirm;
