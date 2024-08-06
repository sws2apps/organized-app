import { Box } from '@mui/material';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import { PersonQualifyConfirmType } from './index.types';

const PersonQualifyConfirm = ({
  open,
  onClose,
  onConfirm,
}: PersonQualifyConfirmType) => {
  const { t } = useAppTranslation();

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Typography className="h2">{t('tr_markQualifiedTitle')}</Typography>
        <Typography className="body-regular" color="var(--grey-400)">
          {t('tr_markQualifiedDesc')}
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
        <Button variant="main" onClick={onConfirm}>
          {t('tr_qualifyAgain')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default PersonQualifyConfirm;
