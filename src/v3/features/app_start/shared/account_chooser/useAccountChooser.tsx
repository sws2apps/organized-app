import { setIsAccountChoose } from '@services/recoil/app';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useAccountChooser = () => {
  const handleChoosePocket = async () => {
    await dbAppSettingsUpdate({ account_type: 'pocket' });
    await setIsAccountChoose(false);
  };

  const handleChooseVIP = async () => {
    await dbAppSettingsUpdate({ account_type: 'vip' });
    await setIsAccountChoose(false);
  };

  return { handleChoosePocket, handleChooseVIP };
};

export default useAccountChooser;
