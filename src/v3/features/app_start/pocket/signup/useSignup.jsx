import { useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { isOnlineState, visitorIDState } from '@states/app';
import {
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

const useSignup = () => {
  const isOnline = useRecoilValue(isOnlineState);
  const visitorID = useRecoilValue(visitorIDState);

  const feedbackRef = useRef();

  const [code, setCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [wrongCode, setWrongCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleReturnChooser = async () => {
    await handleUpdateSetting({ account_type: '' });
    await setIsAccountChoose(true);
  };

  const hideMessage = () => {
    feedbackRef.current.style.animation = 'fade-out 1s forwards';

    setTimeout(() => {
      setHasError(false);
      setWrongCode(false);
      setErrorMessage('');
    }, 1000);
  };

  const handleSignUp = async () => {
    if (isProcessing) return;

    setHasError(false);
    setWrongCode(false);
    setErrorMessage('');

    try {
      if (code.length < 10) {
        setWrongCode(true);

        feedbackRef.current.style.opacity = 0;
        feedbackRef.current.style.display = 'block';
        feedbackRef.current.style.animation = 'fade-in 1s forwards';

        return;
      }

      setIsProcessing(true);
      const { status, data } = await apiPocketSignup(code);

      if (status !== 200) {
        setErrorMessage(getMessageByCode(data.message));
        setHasError(true);
        setIsProcessing(false);
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
    } catch (err) {
      setIsProcessing(false);
      setErrorMessage(getMessageByCode(err.message));
      setHasError(true);
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
    hasError,
    wrongCode,
    errorMessage,
    hideMessage,
    feedbackRef,
  };
};

export default useSignup;
