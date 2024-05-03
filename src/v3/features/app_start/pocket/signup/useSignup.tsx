import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { isOnlineState, visitorIDState } from '@states/app';
import {
  displayOnboardingFeedback,
  setCongAccountConnected,
  setIsAccountChoose,
  setIsAppLoad,
  setIsSetup,
  setIsUnauthorizedRole,
} from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { apiPocketSignup } from '@services/api/user';
import { POCKET_ROLES } from '@constants/index';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { loadApp, runUpdater } from '@services/app';
import { useAppTranslation } from '@hooks/index';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';

const useSignup = () => {
  const { t } = useAppTranslation();

  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const isOnline = useRecoilValue(isOnlineState);
  const visitorID = useRecoilValue(visitorIDState);

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

      clearTimeout(timeoutId.current);

      timeoutId.current = setTimeout(async () => {
        if (code.length < 10) {
          await displayOnboardingFeedback({
            title: t('tr_wrongInvitationCode'),
            message: t('tr_checkInvitationCode'),
          });
          showMessage();
          setIsProcessing(false);
          return;
        }

        const { status, data } = await apiPocketSignup(code);

        if (status !== 200) {
          await displayOnboardingFeedback({
            title: t('tr_errorTryAgain'),
            message: getMessageByCode(data.message),
          });

          showMessage();
          setIsProcessing(false);
          return;
        }

        const approvedRole = data.cong_role.some((role) => POCKET_ROLES.includes(role));

        if (!approvedRole) {
          await dbAppSettingsUpdate({ 'user_settings.account_type': '' });
          await setIsUnauthorizedRole(true);
          return;
        }

        await loadApp();
        await runUpdater();

        setIsSetup(false);
        setTimeout(async () => {
          setCongAccountConnected(true);
          setIsAppLoad(false);
        }, 1000);
      }, 1000);
    } catch (err) {
      setIsProcessing(false);
      await displayOnboardingFeedback({
        title: t('tr_errorTryAgain'),
        message: getMessageByCode(err.message),
      });
      showMessage();
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutId.current);
    };
  });

  return {
    isOnline,
    visitorID,
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
