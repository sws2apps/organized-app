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

  const handleToggleNotificationState = async () => {
    setIsMyAssignmentOpen(false);

    setOpen((prev) => !prev);
  };

  return {
    open,
    handleToggleNotificationState,
    count,
  };
};

export default useAppNotification;
