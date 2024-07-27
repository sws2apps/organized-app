import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { isOnlineState } from '@states/app';
import {
  displayOnboardingFeedback,
  setIsAccountChoose,
} from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { useAppTranslation } from '@hooks/index';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';

const useSignup = () => {
  const { t } = useAppTranslation();

  const isOnline = useRecoilValue(isOnlineState);

  const { hideMessage, message, showMessage, title, variant } = useFeedback();

  const [code, setCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReturnChooser = async () => {
    await dbAppSettingsUpdate({ 'user_settings.account_type': '' });
    await setIsAccountChoose(true);
  };

  const handleSignUp = async () => {
    try {
      if (isProcessing) return;

      hideMessage();

      setIsProcessing(true);

      if (code.length < 10) {
        await displayOnboardingFeedback({
          title: t('tr_wrongInvitationCode'),
          message: t('tr_checkInvitationCode'),
        });
        showMessage();
        setIsProcessing(false);
        return;
      }
    } catch (err) {
      setIsProcessing(false);
      await displayOnboardingFeedback({
        title: t('tr_errorTryAgain'),
        message: getMessageByCode(err.message),
      });
      showMessage();
    }
  };

  return {
    isOnline,
    handleReturnChooser,
    isProcessing,
    setCode,
    handleSignUp,
    code,
    hideMessage,
    title,
    message,
    variant,
  };
};

export default useSignup;
