import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { setIsAccountChoose } from '@services/recoil/app';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';

const useSignin = () => {
  const { message, title, hideMessage, variant } = useFeedback();

  const handleReturnChooser = async () => {
    await dbAppSettingsUpdate({ account_type: '' });
    await setIsAccountChoose(true);
  };

  return { handleReturnChooser, hideMessage, title, message, variant };
};

export default useSignin;
