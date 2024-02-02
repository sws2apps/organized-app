import { setIsAccountChoose } from '@services/recoil/app';
import { handleUpdateSetting } from '@services/dexie/settings';

const useAccountChooser = () => {
  const handleChoosePocket = async () => {
    await handleUpdateSetting({ account_type: 'pocket' });
    await setIsAccountChoose(false);
  };

  const handleChooseVIP = async () => {
    await handleUpdateSetting({ account_type: 'vip' });
    await setIsAccountChoose(false);
  };

  return { handleChoosePocket, handleChooseVIP };
};

export default useAccountChooser;
