import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { handleDeleteDatabase } from '@services/app';
import { useAppTranslation, useFirebaseAuth } from '@hooks/index';
import { userSignOut } from '@services/firebase/auth';
import {
  decryptData,
  encryptData,
  generateKey,
} from '@services/encryption/index';
import { apiValidateMe } from '@services/api/user';
import { displayOnboardingFeedback, setCongID } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { apiSetCongregationAccessCode } from '@services/api/congregation';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { congNumberState } from '@states/settings';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';

const useCongregationAccessCode = () => {
  const { t } = useAppTranslation();

  const { isAuthenticated } = useFirebaseAuth();

  const { hideMessage, message, showMessage, title, variant } = useFeedback();

  const congNumber = useRecoilValue(congNumberState);

  const [isLoading, setIsLoading] = useState(true);
  const [isSetupCode, setIsSetupCode] = useState(true);
  const [tmpAccessCode, setTmpAccessCode] = useState('');
  const [tmpAccessCodeVerify, setTmpAccessCodeVerify] = useState('');
  const [isLengthPassed, setIsLengthPassed] = useState(false);
  const [isNumberPassed, setIsNumberPassed] = useState(false);
  const [isLowerCasePassed, setIsLowerCasePassed] = useState(false);
  const [isUpperCasePassed, setIsUpperCasePassed] = useState(false);
  const [isSpecialSymbolPassed, setIsSpecialSymbolPassed] = useState(false);
  const [isMatch, setIsMatch] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [congAccessCode, setCongAccessCode] = useState('');

  const btnActionDisabled =
    !isLengthPassed ||
    !isNumberPassed ||
    !isLowerCasePassed ||
    !isUpperCasePassed ||
    !isSpecialSymbolPassed ||
    (isSetupCode && !isMatch);

  const handleAction = () => {
    if (isSetupCode) handleSetAccessCode();
    if (!isSetupCode) handleValidateAccessCode();
  };

  const handleSetAccessCode = async () => {
    if (isProcessing) return;
    hideMessage();
    setIsProcessing(true);

    try {
      const encryptionKey = generateKey();
      const encryptedKey = encryptData(encryptionKey, tmpAccessCode);

      const { status, data } = await apiSetCongregationAccessCode(encryptedKey);

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
        'cong_settings.cong_access_code': tmpAccessCode,
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

  const handleValidateAccessCode = async () => {
    if (isProcessing) return;
    hideMessage();
    setIsProcessing(true);

    try {
      decryptData(congAccessCode, tmpAccessCode);

      await dbAppSettingsUpdate({
        'cong_settings.cong_access_code': tmpAccessCode,
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
    const getAccessCode = async () => {
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

      setCongAccessCode(result.cong_access_code);
      setIsSetupCode(result.cong_access_code.length === 0);

      setIsLoading(false);
    };

    if (isAuthenticated) getAccessCode();
  }, [isAuthenticated, congNumber]);

  useEffect(() => {
    setIsLengthPassed(tmpAccessCode.length >= 8);
    setIsNumberPassed(/\d/.test(tmpAccessCode));
    setIsLowerCasePassed(/[a-z]/.test(tmpAccessCode));
    setIsUpperCasePassed(/[A-Z]/.test(tmpAccessCode));
    setIsSpecialSymbolPassed(/[!@#$%^&*(),.?"’:{}|<>]/.test(tmpAccessCode));
    setIsMatch(
      tmpAccessCode.length > 0 && tmpAccessCode === tmpAccessCodeVerify
    );
  }, [tmpAccessCode, tmpAccessCodeVerify]);

  return {
    isLoading,
    isSetupCode,
    tmpAccessCode,
    setTmpAccessCode,
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
    setTmpAccessCodeVerify,
    tmpAccessCodeVerify,
    btnActionDisabled,
  };
};

export default useCongregationAccessCode;
