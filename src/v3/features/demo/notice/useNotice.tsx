import { useState } from 'react';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useNotice = () => {
  const [open, setOpen] = useState(true);

  const handleClose = async () => {
    await dbAppSettingsUpdate({ cong_new: false });
    setOpen(false);
  };

  return { open, handleClose };
};

export default useNotice;
