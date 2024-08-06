import { Box } from '@mui/material';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import { ThemeChangeConfirmType } from './index.types';

const ThemeChangeConfirm = ({
  open,
  onClose,
  onConfirm,
}: ThemeChangeConfirmType) => {
  const { t } = useAppTranslation();

  return (
    <Dialog onClose={onClose} open={open}>
      <Typography className="h2">{t('tr_themeFollowOSDisable')}</Typography>
      <Typography className="body-regular" color="var(--grey-400)">
        {t('tr_themeFollowOSDisableDesc')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
        }}
      >
        <Button variant="main" onClick={onConfirm}>
          {t('tr_yes')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default ThemeChangeConfirm;
