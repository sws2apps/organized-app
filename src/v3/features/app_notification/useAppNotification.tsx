import { useState } from 'react';
import { setIsMyAssignmentOpen } from '@services/recoil/app';

const useAppNotification = () => {
  const [open, setOpen] = useState(false);

  const handleOpenNotification = async () => {
    await setIsMyAssignmentOpen(false);

    setOpen(true);
  };

  const handleCloseNotification = () => {
    setOpen(false);
  };

  return { open, handleOpenNotification, handleCloseNotification };
};

export default useAppNotification;
