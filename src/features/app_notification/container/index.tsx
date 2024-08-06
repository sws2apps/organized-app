import { Stack } from '@mui/material';
import { NotificationContainerType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useContainer from './useContainer';
import Drawer from '@components/drawer';
import NotificationItem from '../notification_item';

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
      <Stack spacing={2.3}>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </Stack>
    </Drawer>
  );
};

export default NotificationContainer;
