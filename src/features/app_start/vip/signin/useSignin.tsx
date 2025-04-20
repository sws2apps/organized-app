import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { setIsAccountChoose } from '@services/states/app';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';

const useSignin = () => {
  const { message, title, hideMessage, variant } = useFeedback();

  const handleReturnChooser = async () => {
    await dbAppSettingsUpdate({ 'user_settings.account_type': '' });
    setIsAccountChoose(true);
  };

  return { handleReturnChooser, hideMessage, title, message, variant };
};

export default useSignin;
