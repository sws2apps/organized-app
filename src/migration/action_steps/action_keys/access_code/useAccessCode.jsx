import { useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { apiSetCongregationAccessCode } from '../../../api';
import { migrationStepState } from '../../../states/main';
import useMigrate from '../../../hooks/useMigrate';
import useSnackBar from '../../../hooks/useSnackBar';
import organizedDb from '../../../../indexedDb/appDb';

const useAccessCode = () => {
  const { showMessage } = useSnackBar();

  const { generateKey, encryptData } = useMigrate();

  const accessCodeRef = useRef();
  const accessCodeConfirmRef = useRef();

  const setCurrentStep = useSetRecoilState(migrationStepState);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSetAccessCode = async () => {
    if (isProcessing) return;

    const key = accessCodeRef.current.value;
    const keyConfirm = accessCodeConfirmRef.current.value;

    if (key !== keyConfirm) {
      showMessage('Keys do not match', 'error');
      return;
    }

    if (key.length < 10) {
      showMessage('At least 10 characters', 'error');
      return;
    }

    try {
      setIsProcessing(true);

      const encryptionKey = generateKey();
      const encryptedKey = encryptData(encryptionKey, key);

      await apiSetCongregationAccessCode(encryptedKey);

      await organizedDb.app_settings.update(1, {
        'cong_settings.cong_access_code': key,
      });

      setIsProcessing(false);

      setCurrentStep(2);
    } catch (error) {
      showMessage(error.message, 'error');
    }
  };

  return {
    isProcessing,
    handleSetAccessCode,
    accessCodeRef,
    accessCodeConfirmRef,
  };
};

export default useAccessCode;
