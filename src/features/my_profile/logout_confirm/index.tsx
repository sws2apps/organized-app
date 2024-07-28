import { Box } from '@mui/material';
import { LogoutConfirmType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useLogoutConfirm from './useLogoutConfirm';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Typography from '@components/typography';

const LogoutConfirm = ({ open, onClose }: LogoutConfirmType) => {
  const { t } = useAppTranslation();

  const { handleLogout } = useLogoutConfirm();

  return (
    <Dialog onClose={onClose} open={open}>
      <Typography className="h2">{t('tr_logoutClearData')}</Typography>
      <Typography className="body-regular" color="var(--grey-400)">
        {t('tr_logoutClearDataDesc')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
        }}
      >
        <Button variant="main" color="red" onClick={handleLogout}>
          {t('tr_logOut')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default LogoutConfirm;
