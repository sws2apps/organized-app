import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { setIsAccountChoose } from '@services/recoil/app';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';
import { useState } from 'react';

const useSignin = () => {
  const { message, title, hideMessage, variant } = useFeedback();

  const [infoMessageData, setInfoMessageData] = useState(null);

  const handleReturnChooser = async () => {
    await dbAppSettingsUpdate({ 'user_settings.account_type': '' });
    await setIsAccountChoose(true);
  };

  return {
    handleReturnChooser,
    hideMessage,
    title,
    message,
    variant,
    infoMessageData,
    setInfoMessageData,
  };
};

export default useSignin;
