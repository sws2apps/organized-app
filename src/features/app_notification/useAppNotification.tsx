import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  isAppNotificationOpenState,
  isMyAssignmentOpenState,
} from '@states/app';
import { notificationsState } from '@states/notification';

const useAppNotification = () => {
  const [open, setOpen] = useRecoilState(isAppNotificationOpenState);

  const setIsMyAssignmentOpen = useSetRecoilState(isMyAssignmentOpenState);

  const notifications = useRecoilValue(notificationsState);

  const count = notifications.filter((record) => !record.read).length;

  const handleOpenNotification = async () => {
    setIsMyAssignmentOpen(false);

    setOpen(true);
  };

  const handleCloseNotification = () => {
    setOpen(false);
  };

  return {
    open,
    handleOpenNotification,
    handleCloseNotification,
    count,
  };
};

export default useAppNotification;
