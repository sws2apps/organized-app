import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { isOnlineState, visitorIDState } from '@states/app';
import {
  displayOnboardingError,
  setCongAccountConnected,
  setIsAccountChoose,
  setIsAppLoad,
  setIsSetup,
  setIsUnauthorizedRole,
  setRootModalOpen,
} from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { apiPocketSignup } from '@services/api/user';
import { POCKET_ROLES } from '@constants/index';
import { handleUpdateSetting, handleUpdateSettingFromRemote } from '@services/dexie/settings';
import { loadApp, runUpdater } from '@services/cpe';
import { apiFetchSchedule } from '@services/api/schedule';
import { handleUpdateScheduleFromRemote } from '@services/cpe/schedules';
import { useAppTranslation } from '@hooks/index';
import { useFeedback } from '@features/app_start';

const useSignup = () => {
  const { t } = useAppTranslation();

  const isOnline = useRecoilValue(isOnlineState);
  const visitorID = useRecoilValue(visitorIDState);

  const { feedbackRef, hideMessage, message, showMessage, title } = useFeedback();

  const [code, setCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReturnChooser = async () => {
    await handleUpdateSetting({ account_type: '' });
    await setIsAccountChoose(true);
  };

  const handleSignUp = async () => {
    try {
      if (isProcessing) return;

      hideMessage();

      setIsProcessing(true);

      setTimeout(async () => {
        if (code.length < 10) {
          await displayOnboardingError({
            title: t('wrongInvitationCode'),
            message: t('checkInvitationCode'),
          });
          showMessage();
          setIsProcessing(false);
          return;
        }

        const { status, data } = await apiPocketSignup(code);

        if (status !== 200) {
          await displayOnboardingError({
            title: t('errorTryAgain'),
            message: getMessageByCode(data.message),
          });

          showMessage();
          setIsProcessing(false);
          return;
        }

        const approvedRole = data.cong_role.some((role) => POCKET_ROLES.includes(role));

        if (!approvedRole) {
          await handleUpdateSetting({ account_type: '' });
          await setIsUnauthorizedRole(true);
          return;
        }

        await loadApp();
        await runUpdater();
        await handleUpdateSettingFromRemote(data);

        await setRootModalOpen(true);
        const { status: scheduleStatus, data: scheduleData } = await apiFetchSchedule();
        if (scheduleStatus === 200) {
          await handleUpdateScheduleFromRemote(scheduleData);
        }
        await setRootModalOpen(false);

        setIsSetup(false);
        setTimeout(async () => {
          setCongAccountConnected(true);
          setIsAppLoad(false);
        }, [1000]);
      }, 1000);
    } catch (err) {
      setIsProcessing(false);
      await displayOnboardingError({
        title: t('errorTryAgain'),
        message: getMessageByCode(err.message),
      });
      showMessage();
    }
  };

  return {
    isOnline,
    visitorID,
    handleReturnChooser,
    isProcessing,
    setCode,
    handleSignUp,
    code,
    hideMessage,
    feedbackRef,
    title,
    message,
  };
};

export default useSignup;
