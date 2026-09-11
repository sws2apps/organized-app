import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { QuickSettingsProps } from './index.types';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
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

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" onClick={onClose}>
          {t('tr_done')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuickSettings;
