import { handleUpdateSetting } from '@services/dexie/settings';
import { setIsAccountChoose } from '@services/recoil/app';
import { useFeedback } from '@features/app_start';

const useSignin = () => {
  const { message, title, hideMessage } = useFeedback();

  const handleReturnChooser = async () => {
    await handleUpdateSetting({ account_type: '' });
    await setIsAccountChoose(true);
  };

  return { handleReturnChooser, hideMessage, title, message };
};

export default useSignin;
