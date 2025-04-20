import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { useSetAtom } from 'jotai';
import { isAccountChooseState, isUserAccountCreatedState } from '@states/app';

const useAccountChooser = () => {
  const setIsAccountChoose = useSetAtom(isAccountChooseState);
  const setIsUserAccountCreated = useSetAtom(isUserAccountCreatedState);

  const handleChoosePocket = async () => {
    await dbAppSettingsUpdate({ 'user_settings.account_type': 'pocket' });
    setIsUserAccountCreated(false);
    setIsAccountChoose(false);
  };

  const handleChooseVIP = async () => {
    await dbAppSettingsUpdate({ 'user_settings.account_type': 'vip' });
    setIsUserAccountCreated(false);
    setIsAccountChoose(false);
  };

  return { handleChoosePocket, handleChooseVIP };
};

export default useAccountChooser;
