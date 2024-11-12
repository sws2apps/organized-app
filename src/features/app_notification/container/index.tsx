import { Stack } from '@mui/material';
import { NotificationContainerType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useContainer from './useContainer';
import Drawer from '@components/drawer';
import NotificationItem from '../notification_item';
import NoNotificationYet from '@features/app_notification/container/noNotificationYet';

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
      sx={
        notifications.length === 0
          ? { ['.pop-up-shadow.MuiBox-root']: { height: 'unset' } }
          : {}
      }
    >
      <Stack spacing={2.3}>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
        {notifications.length === 0 && <NoNotificationYet />}
      </Stack>
    </Drawer>
  );
};

export default NotificationContainer;
