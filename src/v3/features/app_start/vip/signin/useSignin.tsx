import { handleUpdateSetting } from '@services/dexie/settings';
import { setIsAccountChoose } from '@services/recoil/app';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';

const useSignin = () => {
  const { message, title, hideMessage, variant } = useFeedback();

  const handleReturnChooser = async () => {
    await handleUpdateSetting({ account_type: '' });
    await setIsAccountChoose(true);
  };

  return { handleReturnChooser, hideMessage, title, message, variant };
};

export default useSignin;
