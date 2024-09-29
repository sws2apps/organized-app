import { useRecoilValue } from 'recoil';
import { setIsAccountChoose } from '@services/recoil/app';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { cookiesConsentState } from '@states/app';

const useAccountChooser = () => {
  const cookiesConsent = useRecoilValue(cookiesConsentState);

  const handleChoosePocket = async () => {
    if (!cookiesConsent) return;

    await dbAppSettingsUpdate({ 'user_settings.account_type': 'pocket' });
    await setIsAccountChoose(false);
  };

  const handleChooseVIP = async () => {
    if (!cookiesConsent) return;

    await dbAppSettingsUpdate({ 'user_settings.account_type': 'vip' });
    await setIsAccountChoose(false);
  };

  return { handleChoosePocket, handleChooseVIP };
};

export default useAccountChooser;
