import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { handleDeleteDatabase } from '@services/app';
import { useAppTranslation, useFirebaseAuth } from '@hooks/index';
import { userSignOut } from '@services/firebase/auth';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';
import {
  decryptData,
  encryptData,
  generateKey,
} from '@services/encryption/index';
import { apiValidateMe } from '@services/api/user';
import { displayOnboardingFeedback, setCongID } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { apiSetCongregationMasterKey } from '@services/api/congregation';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { congNumberState } from '@states/settings';

const useCongregationMasterKey = () => {
  const { t } = useAppTranslation();

  const { isAuthenticated } = useFirebaseAuth();

  const { hideMessage, message, showMessage, title, variant } = useFeedback();

  const congNumber = useRecoilValue(congNumberState);

  const [isLoading, setIsLoading] = useState(true);
  const [isSetupCode, setIsSetupCode] = useState(true);
  const [tmpMasterKey, setTmpMasterKey] = useState('');
  const [tmpMasterKeyVerify, setTmpMasterKeyVerify] = useState('');
  const [isLengthPassed, setIsLengthPassed] = useState(false);
  const [isNumberPassed, setIsNumberPassed] = useState(false);
  const [isLowerCasePassed, setIsLowerCasePassed] = useState(false);
  const [isUpperCasePassed, setIsUpperCasePassed] = useState(false);
  const [isSpecialSymbolPassed, setIsSpecialSymbolPassed] = useState(false);
  const [isMatch, setIsMatch] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [congMasterKey, setCongMasterKey] = useState('');

  const btnActionDisabled =
    !isLengthPassed ||
    !isNumberPassed ||
    !isLowerCasePassed ||
    !isUpperCasePassed ||
    !isSpecialSymbolPassed ||
    (isSetupCode && !isMatch);

  const handleAction = () => {
    if (isSetupCode) handleSetMasterKey();
    if (!isSetupCode) handleValidateMasterKey();
  };

  const handleSetMasterKey = async () => {
    if (isProcessing) return;
    hideMessage();
    setIsProcessing(true);

    try {
      const encryptionKey = generateKey();
      const encryptedKey = encryptData(encryptionKey, tmpMasterKey);

      const { status, data } = await apiSetCongregationMasterKey(encryptedKey);

      if (status !== 200) {
        await displayOnboardingFeedback({
          title: t('tr_errorGeneric'),
          message: getMessageByCode(data.message),
        });
        showMessage();

        setIsProcessing(false);
        return;
      }

      await dbAppSettingsUpdate({
        'cong_settings.cong_master_key': tmpMasterKey,
      });
    } catch (err) {
      await displayOnboardingFeedback({
        title: t('tr_errorGeneric'),
        message: getMessageByCode(err.message),
      });
      showMessage();

      setIsProcessing(false);
    }
  };

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
        title: t('tr_errorGeneric'),
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
      setIsSetupCode(result.cong_master_key.length === 0);

      setIsLoading(false);
    };

    if (isAuthenticated) getMasterKey();
  }, [isAuthenticated, congNumber]);

  useEffect(() => {
    setIsLengthPassed(tmpMasterKey.length >= 16);
    setIsNumberPassed(/\d/.test(tmpMasterKey));
    setIsLowerCasePassed(/[a-z]/.test(tmpMasterKey));
    setIsUpperCasePassed(/[A-Z]/.test(tmpMasterKey));
    setIsSpecialSymbolPassed(/[!@#$%^&*(),.?"’:{}|<>]/.test(tmpMasterKey));
    setIsMatch(tmpMasterKey.length > 0 && tmpMasterKey === tmpMasterKeyVerify);
  }, [tmpMasterKey, tmpMasterKeyVerify]);

  return {
    isLoading,
    isSetupCode,
    tmpMasterKey,
    setTmpMasterKey,
    tmpMasterKeyVerify,
    setTmpMasterKeyVerify,
    isLengthPassed,
    isNumberPassed,
    isLowerCasePassed,
    isUpperCasePassed,
    isSpecialSymbolPassed,
    isProcessing,
    handleAction,
    message,
    title,
    hideMessage,
    variant,
    isMatch,
    btnActionDisabled,
  };
};

export default useCongregationMasterKey;
