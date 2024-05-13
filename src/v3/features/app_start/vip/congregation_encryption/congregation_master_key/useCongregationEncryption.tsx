import { useEffect, useState } from 'react';
import { handleDeleteDatabase } from '@services/app';
import { useAppTranslation, useFirebaseAuth } from '@hooks/index';
import { userSignOut } from '@services/firebase/auth';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';
import { decryptData, encryptData, generateKey } from '@services/encryption/index';
import { apiValidateMe } from '@services/api/user';
import { displayOnboardingFeedback, setCongID } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { apiSetCongregationEncryption } from '@services/api/congregation';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useCongregationEncryption = () => {
  const { t } = useAppTranslation();

  const { isAuthenticated } = useFirebaseAuth();

  const { hideMessage, message, showMessage, title, variant } = useFeedback();

  const [isLoading, setIsLoading] = useState(true);
  const [isSetupCode, setIsSetupCode] = useState(true);
  const [tmpEncryptionCode, setTmpEncryptionCode] = useState('');
  const [isLengthPassed, setIsLengthPassed] = useState(false);
  const [isNumberPassed, setIsNumberPassed] = useState(false);
  const [isLowerCasePassed, setIsLowerCasePassed] = useState(false);
  const [isUpperCasePassed, setIsUpperCasePassed] = useState(false);
  const [isSpecialSymbolPassed, setIsSpecialSymbolPassed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [congCode, setCongCode] = useState('');

  const handleAction = () => {
    if (isSetupCode) handleSetEncryptionKey();
    if (!isSetupCode) handleValidateEncryptionKey();
  };

  const handleSetEncryptionKey = async () => {
    if (isProcessing) return;
    hideMessage();
    setIsProcessing(true);

    try {
      const encryptionKey = generateKey();
      const encryptedKey = encryptData(encryptionKey, tmpEncryptionCode);

      const { status, data } = await apiSetCongregationEncryption(encryptedKey);

      if (status !== 200) {
        await displayOnboardingFeedback({
          title: t('tr_errorGeneric'),
          message: getMessageByCode(data.message),
        });
        showMessage();

        setIsProcessing(false);
        return;
      }

      await dbAppSettingsUpdate({ 'cong_settings.cong_master_key': tmpEncryptionCode });
    } catch (err) {
      await displayOnboardingFeedback({
        title: t('tr_errorGeneric'),
        message: getMessageByCode(err.message),
      });
      showMessage();

      setIsProcessing(false);
    }
  };

  const handleValidateEncryptionKey = async () => {
    if (isProcessing) return;
    hideMessage();
    setIsProcessing(true);

    try {
      decryptData(congCode, tmpEncryptionCode);

      await dbAppSettingsUpdate({ 'cong_settings.cong_master_key': tmpEncryptionCode });
    } catch (err) {
      await displayOnboardingFeedback({
        title: t('tr_errorGeneric'),
        message: t('tr_encryptionCodeInvalid'),
      });
      showMessage();

      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const getEncryptionKey = async () => {
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

      await setCongID(result.cong_id);

      setCongCode(result.cong_encryption);
      setIsSetupCode(result.cong_encryption.length === 0);

      setIsLoading(false);
    };

    if (isAuthenticated) getEncryptionKey();
  }, [isAuthenticated]);

  useEffect(() => {
    setIsLengthPassed(tmpEncryptionCode.length >= 16);
    setIsNumberPassed(/\d/.test(tmpEncryptionCode));
    setIsLowerCasePassed(/[a-z]/.test(tmpEncryptionCode));
    setIsUpperCasePassed(/[A-Z]/.test(tmpEncryptionCode));
    setIsSpecialSymbolPassed(/[!@#$%^&*(),.?"’:{}|<>]/.test(tmpEncryptionCode));
  }, [tmpEncryptionCode]);

  return {
    isLoading,
    isSetupCode,
    tmpEncryptionCode,
    setTmpEncryptionCode,
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
  };
};

export default useCongregationEncryption;
