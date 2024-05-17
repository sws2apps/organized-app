import { useRecoilState, useSetRecoilState } from 'recoil';
import { isAppNotificationOpenState, isMyAssignmentOpenState } from '@states/app';

const useAppNotification = () => {
  const [open, setOpen] = useRecoilState(isAppNotificationOpenState);

  const setIsMyAssignmentOpen = useSetRecoilState(isMyAssignmentOpenState);

  const handleOpenNotification = async () => {
    setIsMyAssignmentOpen(false);

    setOpen(true);
  };

  const handleCloseNotification = () => {
    setOpen(false);
  };

  return { open, handleOpenNotification, handleCloseNotification };
};

export default useAppNotification;
