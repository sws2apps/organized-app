import { useRef, useState } from 'react';

import { apiSetCongregationMasterKey } from '../../../api';
import useSnackBar from '../../../hooks/useSnackBar';
import useMigrate from '../../../hooks/useMigrate';
import organizedDb from '../../../../indexedDb/appDb';

const useMasterKey = ({ next }) => {
  const { showMessage } = useSnackBar();

  const { generateKey, encryptData } = useMigrate();

  const masterKeyRef = useRef();
  const masterKeyConfirmRef = useRef();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSetMasterKey = async () => {
    if (isProcessing) return;

    const key = masterKeyRef.current.value;
    const keyConfirm = masterKeyConfirmRef.current.value;

    if (key !== keyConfirm) {
      showMessage('Keys do not match', 'error');
      return;
    }

    if (key.length < 16) {
      showMessage('At least 16 characters', 'error');
      return;
    }

    try {
      setIsProcessing(true);

      const encryptionKey = generateKey();
      const encryptedKey = encryptData(encryptionKey, key);

      await apiSetCongregationMasterKey(encryptedKey);

      await organizedDb.app_settings.update(1, {
        'cong_settings.cong_master_key': key,
      });

      setIsProcessing(false);

      next();
    } catch (error) {
      showMessage(error.message, 'error');
    }
  };

  return {
    isProcessing,
    handleSetMasterKey,
    masterKeyRef,
    masterKeyConfirmRef,
  };
};

export default useMasterKey;
