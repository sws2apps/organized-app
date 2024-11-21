import { Box } from '@mui/material';
import { IconClose } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useMigration from './useMigration';
import Button from '@components/button';
import Dialog from '@components/dialog';
import IconButton from '@components/icon_button';
import Markup from '@components/text_markup';
import Typography from '@components/typography';

const MigrationNotice = () => {
  const { t } = useAppTranslation();

  const { handleClose, open } = useMigration();

  return (
    <Dialog onClose={handleClose} open={open} sx={{ padding: '24px' }}>
      <Box
        sx={{
          display: 'flex',
          padding: 'var(--radius-none)',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Typography className="h2">{t('tr_migrationTitle')}</Typography>
        <IconButton onClick={handleClose}>
          <IconClose color="var(--black)" />
        </IconButton>
      </Box>

      <Markup
        content={t('tr_migrationDesc')}
        className="body-regular"
        anchorClassName="h4"
      />

      <Button variant="main" onClick={handleClose} sx={{ width: '100%' }}>
        {t('tr_ok')}
      </Button>
    </Dialog>
  );
};

export default MigrationNotice;
