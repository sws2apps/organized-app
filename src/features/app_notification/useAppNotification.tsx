import { useAtomValue, useAtom, useSetAtom } from 'jotai';
import {
  isAppNotificationOpenState,
  isMyAssignmentOpenState,
} from '@states/app';
import { notificationsState } from '@states/notification';

const useAppNotification = () => {
  const [open, setOpen] = useAtom(isAppNotificationOpenState);

  const setIsMyAssignmentOpen = useSetAtom(isMyAssignmentOpenState);

  const notifications = useAtomValue(notificationsState);

  const count = notifications.filter((record) => !record.read).length;

  const handleToggleNotificationState = () => {
    setIsMyAssignmentOpen(false);

    setOpen((prev) => !prev);
  };

  const handleCloseNotification = () => {
    setOpen(false);
  };

  return {
    open,
    handleToggleNotificationState,
    handleCloseNotification,
    count,
  };
};

export default useAppNotification;
