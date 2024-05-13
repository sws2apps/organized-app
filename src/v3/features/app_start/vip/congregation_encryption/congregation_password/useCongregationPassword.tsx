import { useEffect, useState } from 'react';
import { handleDeleteDatabase, loadApp, runUpdater } from '@services/app';
import { useAppTranslation, useFirebaseAuth } from '@hooks/index';
import { userSignOut } from '@services/firebase/auth';
import { decryptData, encryptData, generateKey } from '@services/encryption/index';
import { apiValidateMe } from '@services/api/user';
import {
  displayOnboardingFeedback,
  setCongAccountConnected,
  setCongID,
  setIsAppLoad,
  setIsSetup,
  setOfflineOverride,
} from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { apiSetCongregationPassword } from '@services/api/congregation';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';

const useCongregationPassword = () => {
  const { t } = useAppTranslation();

  const { isAuthenticated } = useFirebaseAuth();

  const { hideMessage, message, showMessage, title, variant } = useFeedback();

  const [isLoading, setIsLoading] = useState(true);
  const [isSetupCode, setIsSetupCode] = useState(true);
  const [tmpPassword, setTmpPassword] = useState('');
  const [tmpPasswordVerify, setTmpPasswordVerify] = useState('');
  const [isLengthPassed, setIsLengthPassed] = useState(false);
  const [isNumberPassed, setIsNumberPassed] = useState(false);
  const [isLowerCasePassed, setIsLowerCasePassed] = useState(false);
  const [isUpperCasePassed, setIsUpperCasePassed] = useState(false);
  const [isSpecialSymbolPassed, setIsSpecialSymbolPassed] = useState(false);
  const [isMatch, setIsMatch] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [congPassword, setCongPassword] = useState('');

  const btnActionDisabled =
    !isLengthPassed ||
    !isNumberPassed ||
    !isLowerCasePassed ||
    !isUpperCasePassed ||
    !isSpecialSymbolPassed ||
    (isSetupCode && !isMatch);

  const handleAction = () => {
    if (isSetupCode) handleSetPassword();
    if (!isSetupCode) handleValidatePassword();
  };

  const handleSetPassword = async () => {
    if (isProcessing) return;
    hideMessage();
    setIsProcessing(true);

    try {
      const encryptionKey = generateKey();
      const encryptedKey = encryptData(encryptionKey, tmpPassword);

      const { status, data } = await apiSetCongregationPassword(encryptedKey);

      if (status !== 200) {
        await displayOnboardingFeedback({
          title: t('tr_errorGeneric'),
          message: getMessageByCode(data.message),
        });
        showMessage();

        setIsProcessing(false);
        return;
      }

      await dbAppSettingsUpdate({ 'cong_settings.cong_password': tmpPassword });

      await loadApp();

      await setIsSetup(false);

      await runUpdater();
      setTimeout(() => {
        setOfflineOverride(false);
        setCongAccountConnected(true);
        setIsAppLoad(false);
      }, 2000);
    } catch (err) {
      await displayOnboardingFeedback({
        title: t('tr_errorGeneric'),
        message: getMessageByCode(err.message),
      });
      showMessage();

      setIsProcessing(false);
    }
  };

  const handleValidatePassword = async () => {
    if (isProcessing) return;
    hideMessage();
    setIsProcessing(true);

    try {
      decryptData(congPassword, tmpPassword);

      await dbAppSettingsUpdate({ 'cong_settings.cong_password': tmpPassword });

      await loadApp();

      await setIsSetup(false);

      await runUpdater();
      setTimeout(() => {
        setOfflineOverride(false);
        setCongAccountConnected(true);
        setIsAppLoad(false);
      }, 2000);
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
    const getPassword = async () => {
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

      setCongPassword(result.cong_password);
      setIsSetupCode(result.cong_password.length === 0);

      setIsLoading(false);
    };

    if (isAuthenticated) getPassword();
  }, [isAuthenticated]);

  useEffect(() => {
    setIsLengthPassed(tmpPassword.length >= 8);
    setIsNumberPassed(/\d/.test(tmpPassword));
    setIsLowerCasePassed(/[a-z]/.test(tmpPassword));
    setIsUpperCasePassed(/[A-Z]/.test(tmpPassword));
    setIsSpecialSymbolPassed(/[!@#$%^&*(),.?"’:{}|<>]/.test(tmpPassword));
    setIsMatch(tmpPassword.length > 0 && tmpPassword === tmpPasswordVerify);
  }, [tmpPassword, tmpPasswordVerify]);

  return {
    isLoading,
    isSetupCode,
    tmpPassword,
    setTmpPassword,
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
    setTmpPasswordVerify,
    tmpPasswordVerify,
    btnActionDisabled,
  };
};

export default useCongregationPassword;
