import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { isOnlineState, visitorIDState } from '@states/app';
import {
  displaySnackNotification,
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

  const [code, setCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReturnChooser = async () => {
    await handleUpdateSetting({ account_type: '' });
    await setIsAccountChoose(true);
  };

  const handleSignUp = async () => {
    try {
      if (code.length < 10) {
        await displaySnackNotification({ message: getMessageByCode('INPUT_INVALID'), severity: 'warning' });
        return;
      }

      setIsProcessing(true);
      const { status, data } = await apiPocketSignup(code);

      if (status !== 200) {
        await displaySnackNotification({ message: getMessageByCode(data.message), severity: 'warning' });
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
      await displaySnackNotification({ message: err.message, severity: 'error' });
    }
  };

  return { isOnline, visitorID, handleReturnChooser, isProcessing, setCode, handleSignUp, code };
};

export default useSignup;
