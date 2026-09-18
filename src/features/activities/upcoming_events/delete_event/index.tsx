import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { DeleteEventProps } from './index.types';
import Button from '@components/button';
import Dialog from '@components/dialog';

const DeleteEvent = ({ open, title, onClose, onConfirm }: DeleteEventProps) => {
  const { t } = useAppTranslation();

  return (
    <Dialog
      onClose={onClose}
      open={open}
      title={t('tr_deleteEventTitle')}
      description={t('tr_deleteEventDesc', { eventName: title })}
      actions={
        <Stack spacing="8px" width="100%">
          <Button variant="main" color="red" onClick={onConfirm}>
            {t('tr_delete')}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            {t('tr_cancel')}
          </Button>
        </Stack>
      }
    />
  );
};

export default DeleteEvent;
