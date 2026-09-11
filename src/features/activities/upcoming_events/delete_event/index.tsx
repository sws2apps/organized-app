import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { DeleteEventProps } from './index.types';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Typography from '@components/typography';

const DeleteEvent = ({ open, title, onClose, onConfirm }: DeleteEventProps) => {
  const { t } = useAppTranslation();

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      <Stack spacing="16px">
        <Typography className="h2">{t('tr_deleteEventTitle')}</Typography>

        <Typography color="var(--grey-400)">
          {t('tr_deleteEventDesc', { eventName: title })}
        </Typography>
      </Stack>

      <Stack spacing="8px" width="100%">
        <Button variant="main" color="red" onClick={onConfirm}>
          {t('tr_delete')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Dialog>
  );
};

export default DeleteEvent;
