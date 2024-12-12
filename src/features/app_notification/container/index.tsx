import { Box, Stack } from '@mui/material';
import { NotificationContainerType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useContainer from './useContainer';
import Drawer from '@components/drawer';
import NotificationItem from '../notification_item';
import NoNotificationImg from '@assets/img/illustration_no_notifications.svg?component';
import Typography from '@components/typography';

const NotificationContainer = ({
  onClose,
  open,
}: NotificationContainerType) => {
  const { t } = useAppTranslation();

  const { notifications } = useContainer();

  return (
    <Drawer
      anchor="right"
      onClose={onClose}
      open={open}
      title={t('tr_notifications')}
    >
      <Box
        sx={{
          height: 'calc(100dvh - 180px)',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
        }}
      >
        {notifications.length === 0 && (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
            }}
          >
            <NoNotificationImg viewBox="0 0 128 128" />
            <Stack spacing="8px">
              <Typography className="h2">{t('tr_noNotifications')}</Typography>
              <Typography color="var(--grey-400)">
                {t('tr_noNotificationsDesc')}
              </Typography>
            </Stack>
          </Box>
        )}

        {notifications.length > 0 && (
          <Stack spacing={2.3}>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Drawer>
  );
};

export default NotificationContainer;
