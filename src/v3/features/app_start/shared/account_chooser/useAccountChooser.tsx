import { setIsAccountChoose } from '@services/recoil/app';
import { dbAppSettingsSave } from '@services/dexie/settings';

const useAccountChooser = () => {
  const handleChoosePocket = async () => {
    await dbAppSettingsSave({ account_type: 'pocket' });
    await setIsAccountChoose(false);
  };

  const handleChooseVIP = async () => {
    await dbAppSettingsSave({ account_type: 'vip' });
    await setIsAccountChoose(false);
  };

  return { handleChoosePocket, handleChooseVIP };
};

export default useAccountChooser;
