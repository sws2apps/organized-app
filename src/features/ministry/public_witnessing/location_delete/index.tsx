import { useSetAtom } from 'jotai';
import { useState } from 'react';
import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { publicWitnessingDeleteLocationState } from '@states/public_witnessing';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Typography from '@components/typography';
import { LocationDeleteProps } from './index.types';

const LocationDelete = ({ open, onClose, location }: LocationDeleteProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const { t } = useAppTranslation();
  const deleteLocation = useSetAtom(publicWitnessingDeleteLocationState);

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      await deleteLocation(location);

      onClose();
    } catch (error) {
      setDeleteError((error as Error).message);
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode((error as Error).message),
        severity: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      title={t('tr_deletePWLocation')}
      actions={
        <Stack spacing="8px" sx={{ width: '100%' }}>
          <Button
            variant="main"
            color="red"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {t('tr_delete')}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            {t('tr_cancel')}
          </Button>
        </Stack>
      }
      open={open}
      onClose={onClose}
      sx={{ padding: '24px' }}
    >
      <Stack spacing="16px">
        {deleteError && (
          <Typography role="alert" sx={{ color: 'var(--red-dark)' }}>
            {t(deleteError)}
          </Typography>
        )}
        <Typography>{location.location_data.name}</Typography>
        <Typography sx={{ color: 'var(--grey-400)' }}>
          {t('tr_deletePWLocationDesc')}
        </Typography>
      </Stack>
    </Dialog>
  );
};

export default LocationDelete;
