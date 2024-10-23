import { useState } from 'react';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useNotice = () => {
  const [open, setOpen] = useState(true);

  const handleClose = async () => {
    await dbAppSettingsUpdate({ 'cong_settings.cong_new': false });
    setOpen(false);
  };

  const handleOpenRealApp = () => {
    window.open('https://organized-app.com', '_blank');
  };

  return { open, handleClose, handleOpenRealApp };
};

export default useNotice;
