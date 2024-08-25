import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { QuickSettingsProps } from './index.types';
import Dialog from '@components/dialog';
import Typography from '@components/typography';
import Button from '@components/button';

const QuickSettings = ({
  open,
  onClose,
  title,
  children,
}: QuickSettingsProps) => {
  const { t } = useAppTranslation();

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Typography className="h3">
          {t('tr_quickSettings')} – {title}
        </Typography>
        <Typography color="var(--grey-400)">
          {t('tr_quickSettingsDesc')}
        </Typography>
      </Box>

      {children}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
        }}
      >
        <Button variant="main" onClick={onClose}>
          {t('tr_done')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default QuickSettings;
