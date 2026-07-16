import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { dbPublicWitnessingLocationsSave } from '@services/dexie/public_witnessing_locations';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Typography from '@components/typography';
import { LocationDeleteProps } from './index.types';

const LocationDelete = ({ open, onClose, location }: LocationDeleteProps) => {
  const { t } = useAppTranslation();

  const handleDelete = async () => {
    try {
      const record = structuredClone(location);
      record.location_data._deleted = true;
      record.location_data.updatedAt = new Date().toISOString();

      await dbPublicWitnessingLocationsSave(record);

      onClose();
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ padding: '24px' }}>
      <Stack spacing="16px">
        <Typography className="h2">{t('tr_deletePWLocation')}</Typography>

        <Typography color="var(--grey-400)">
          {t('tr_deletePWLocationDesc')}
        </Typography>
      </Stack>

      <Stack spacing="8px" width="100%">
        <Button variant="main" color="red" onClick={handleDelete}>
          {t('tr_delete')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Dialog>
  );
};

export default LocationDelete;
