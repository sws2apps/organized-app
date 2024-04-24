import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { congDiscoverableState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useVisibilityToggle = () => {
  const isVisible = useRecoilValue(congDiscoverableState);

  const [openConfirm, setOpenConfirm] = useState(false);

  const handleCloseConfirm = () => setOpenConfirm(false);

  const handleToggleVisibility = async (checked: boolean) => {
    if (checked) {
      await handleConfirmAction(checked);
    }

    if (!checked) {
      setOpenConfirm(true);
    }
  };

  const handleVisibilityOff = async () => {
    await handleConfirmAction(false);
    setOpenConfirm(false);
  };

  const handleConfirmAction = async (checked: boolean) => {
    await dbAppSettingsUpdate({
      'cong_discoverable.updatedAt': new Date().toISOString(),
      'cong_discoverable.value': checked,
    });
  };

  return {
    isVisible,
    handleToggleVisibility,
    openConfirm,
    handleCloseConfirm,
    handleVisibilityOff,
  };
};

export default useVisibilityToggle;
