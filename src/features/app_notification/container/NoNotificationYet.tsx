import { TextMarkup } from '@components/index';
import { useAppTranslation } from '@hooks/index';
import { Box, Typography } from '@mui/material';
import NoNotificationImg from '@assets/img/no_notifications.svg?component';

const NoNotificationYet = () => {
  const { t } = useAppTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        padding: '80px 0',
      }}
    >
      <NoNotificationImg />
      <Box>
        <Typography className="h1">{t('tr_noNotifications')}</Typography>
        <TextMarkup
          content={t('tr_noNotificationsDesc')}
          className="body-regular"
          color="var(--grey-400)"
          anchorClassName="h4"
          anchorColor="var(--accent-dark)"
        />
      </Box>
    </Box>
  );
};

export default NoNotificationYet;
