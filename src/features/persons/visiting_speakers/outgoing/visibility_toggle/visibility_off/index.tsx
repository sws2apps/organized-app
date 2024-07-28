import { Box } from '@mui/material';
import { VisibilityOffConfirmType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import Dialog from '@components/dialog';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';

const VisibilityOffConfirm = ({
  open,
  onClose,
  onConfirm,
}: VisibilityOffConfirmType) => {
  const { t } = useAppTranslation();

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Typography className="h2">{t('tr_outgoingSpeakersHide')}</Typography>
        <TextMarkup
          className="body-regular"
          color="var(--grey-400)"
          content={t('tr_outgoingSpeakersHideDesc')}
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
        <Button variant="main" onClick={onConfirm}>
          {t('tr_hide')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default VisibilityOffConfirm;
