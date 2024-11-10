import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { EnableSyncProps } from './index.types';
import Button from '@components/button';
import DataSharing from '@features/congregation/settings/congregation_privacy/data_sharing';
import Dialog from '@components/dialog';
import Typography from '@components/typography';

const EnableSync = ({ onClose, open, onContinue }: EnableSyncProps) => {
  const { t } = useAppTranslation();

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      <Typography className="h2">{t('tr_addUserSyncNeeded')}</Typography>

      <Typography color="var(--grey-400)">
        {t('tr_addUserSyncNeededDesc')}
      </Typography>

      <DataSharing />

      <Stack spacing="8px" width="100%">
        <Button variant="main" onClick={onContinue}>
          {t('tr_continue')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Dialog>
  );
};

export default EnableSync;
