import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { AccessCodeChangeType } from './index.types';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import {
  apiGetCongregationAccessCode,
  apiSetCongregationAccessCode,
} from '@services/api/congregation';
import { decryptData, encryptData } from '@services/encryption';
import { congAccessCodeState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useAccessCodeChange = (onClose: AccessCodeChangeType['onClose']) => {
  const localAccessCode = useRecoilValue(congAccessCodeState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAccessCode, setCurrentAccessCode] = useState('');
  const [newAccessCode, setNewAccessCode] = useState('');
  const [confirmAccessCode, setConfirmAccessCode] = useState('');

  const handleCurrentAccessCodeChange = (value: string) =>
    setCurrentAccessCode(value);

  const handleNewAccessCodeChange = (value: string) => setNewAccessCode(value);

  const handleConfirmAccessCodeChange = (value: string) =>
    setConfirmAccessCode(value);

  const handleChangeAccessCode = async () => {
    if (
      currentAccessCode.length === 0 ||
      newAccessCode.length === 0 ||
      confirmAccessCode.length === 0 ||
      confirmAccessCode.length < 8 ||
      newAccessCode !== confirmAccessCode
    )
      return;

    try {
      setIsProcessing(true);

      const { status, message } = await apiGetCongregationAccessCode();

      if (status !== 200) {
        await displaySnackNotification({
          header: getMessageByCode('error_app_generic-title'),
          message: getMessageByCode(message),
          severity: 'error',
        });

        return;
      }

      const remoteAccessCode = decryptData(message, localAccessCode);
      const newAccessCode = encryptData(remoteAccessCode, confirmAccessCode);

      const setCodeFetch = await apiSetCongregationAccessCode(newAccessCode);

      if (setCodeFetch.status !== 200) {
        await displaySnackNotification({
          header: getMessageByCode('error_app_generic-title'),
          message: getMessageByCode(setCodeFetch.data.message),
          severity: 'error',
        });

        return;
      }

      await dbAppSettingsUpdate({
        'cong_settings.cong_access_code': confirmAccessCode,
      });

      setIsProcessing(false);
      onClose?.();
    } catch (error) {
      console.error(error);

      setIsProcessing(false);
      onClose?.();

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return {
    isProcessing,
    handleChangeAccessCode,
    currentAccessCode,
    handleCurrentAccessCodeChange,
    newAccessCode,
    handleNewAccessCodeChange,
    confirmAccessCode,
    handleConfirmAccessCodeChange,
  };
};

export default useAccessCodeChange;
