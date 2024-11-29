import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { MasterKeyChangeType } from './index.types';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import {
  apiGetCongregationMasterKey,
  apiSetCongregationMasterKey,
} from '@services/api/congregation';
import { congMasterKeyState } from '@states/settings';
import { decryptData, encryptData } from '@services/encryption';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useMasterKeyChange = (onClose: MasterKeyChangeType['onClose']) => {
  const localMasterKey = useRecoilValue(congMasterKeyState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMasterKey, setCurrentMasterKey] = useState('');
  const [newMasterKey, setNewMasterKey] = useState('');
  const [confirmMasterKey, setConfirmMasterKey] = useState('');

  const handleCurrentMasterKeyChange = (value: string) =>
    setCurrentMasterKey(value);

  const handleNewMasterKeyChange = (value: string) => setNewMasterKey(value);

  const handleConfirmMasterKeyChange = (value: string) =>
    setConfirmMasterKey(value);

  const handleChangeMasterKey = async () => {
    if (
      currentMasterKey.length === 0 ||
      newMasterKey.length === 0 ||
      confirmMasterKey.length === 0 ||
      confirmMasterKey.length < 16 ||
      newMasterKey !== confirmMasterKey
    )
      return;

    try {
      setIsProcessing(true);

      const { status, message } = await apiGetCongregationMasterKey();

      if (status !== 200) {
        await displaySnackNotification({
          header: getMessageByCode('error_app_generic-title'),
          message: getMessageByCode(message),
          severity: 'error',
        });

        return;
      }

      const remoteMasterKey = decryptData(message, localMasterKey);
      const newMasterKey = encryptData(remoteMasterKey, confirmMasterKey);

      const setKeyFetch = await apiSetCongregationMasterKey(newMasterKey);

      if (setKeyFetch.status !== 200) {
        await displaySnackNotification({
          header: getMessageByCode('error_app_generic-title'),
          message: getMessageByCode(setKeyFetch.data.message),
          severity: 'error',
        });

        return;
      }

      await dbAppSettingsUpdate({
        'cong_settings.cong_master_key': confirmMasterKey,
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
    handleChangeMasterKey,
    currentMasterKey,
    handleCurrentMasterKeyChange,
    newMasterKey,
    handleNewMasterKeyChange,
    confirmMasterKey,
    handleConfirmMasterKeyChange,
  };
};

export default useMasterKeyChange;
