import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { handleDeleteDatabase } from '@services/app';
import { useAppTranslation, useFirebaseAuth } from '@hooks/index';
import { userSignOut } from '@services/firebase/auth';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';
import { decryptData } from '@services/encryption/index';
import { apiValidateMe } from '@services/api/user';
import { displayOnboardingFeedback, setCongID } from '@services/recoil/app';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { congNumberState } from '@states/settings';

const useCongregationMasterKey = () => {
  const { t } = useAppTranslation();

  const { isAuthenticated } = useFirebaseAuth();

  const { hideMessage, message, showMessage, title, variant } = useFeedback();

  const congNumber = useRecoilValue(congNumberState);

  const [isLoading, setIsLoading] = useState(true);
  const [tmpMasterKey, setTmpMasterKey] = useState('');
  const [tmpMasterKeyVerify, setTmpMasterKeyVerify] = useState('');
  const [isLengthPassed, setIsLengthPassed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [congMasterKey, setCongMasterKey] = useState('');

  const btnActionDisabled = !isLengthPassed;

  const handleValidateMasterKey = async () => {
    if (isProcessing) return;
    hideMessage();
    setIsProcessing(true);

    try {
      decryptData(congMasterKey, tmpMasterKey);

      await dbAppSettingsUpdate({
        'cong_settings.cong_master_key': tmpMasterKey,
      });
    } catch (err) {
      console.error(err);
      await displayOnboardingFeedback({
        title: t('error_app_generic-title'),
        message: t('tr_encryptionCodeInvalid'),
      });
      showMessage();

      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const getMasterKey = async () => {
      setIsLoading(true);

      const { status, result } = await apiValidateMe();

      if (status === 403) {
        await userSignOut();
        return;
      }

      // congregation not found -> user not authorized and delete local data
      if (status === 404) {
        await handleDeleteDatabase();
        return;
      }

      if (status === 200) {
        if (congNumber.length > 0 && result.cong_number !== congNumber) {
          await handleDeleteDatabase();
          return;
        }
      }

      await setCongID(result.cong_id);
      setCongMasterKey(result.cong_master_key);
      setIsLoading(false);
    };

    if (isAuthenticated) getMasterKey();
  }, [isAuthenticated, congNumber]);

  useEffect(() => {
    setIsLengthPassed(tmpMasterKey.length >= 16);
  }, [tmpMasterKey, tmpMasterKeyVerify]);

  return {
    isLoading,
    tmpMasterKey,
    setTmpMasterKey,
    tmpMasterKeyVerify,
    setTmpMasterKeyVerify,
    isLengthPassed,
    isProcessing,
    handleValidateMasterKey,
    message,
    title,
    hideMessage,
    variant,
    btnActionDisabled,
  };
};

export default useCongregationMasterKey;
