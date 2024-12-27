import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { encryptData, generateKey } from '@services/encryption/index';
import { displayOnboardingFeedback } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { apiSetCongregationMasterKey } from '@services/api/congregation';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { congregationCreateStepState } from '@states/app';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';

const useCongregationMasterKey = () => {
  const { t } = useAppTranslation();

  const { hideMessage, message, showMessage, title, variant } = useFeedback();

  const setCurrentStep = useSetRecoilState(congregationCreateStepState);

  const [tmpMasterKey, setTmpMasterKey] = useState('');
  const [tmpMasterKeyVerify, setTmpMasterKeyVerify] = useState('');
  const [isLengthPassed, setIsLengthPassed] = useState(false);
  const [isNumberPassed, setIsNumberPassed] = useState(false);
  const [isLowerCasePassed, setIsLowerCasePassed] = useState(false);
  const [isUpperCasePassed, setIsUpperCasePassed] = useState(false);
  const [isSpecialSymbolPassed, setIsSpecialSymbolPassed] = useState(false);
  const [isMatch, setIsMatch] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const btnActionDisabled =
    !isLengthPassed ||
    !isNumberPassed ||
    !isLowerCasePassed ||
    !isUpperCasePassed ||
    !isSpecialSymbolPassed ||
    !isMatch;

  const handleSetMasterKey = async () => {
    if (isProcessing) return;
    hideMessage();
    setIsProcessing(true);

    try {
      const encryptionKey = generateKey();
      const encryptedKey = encryptData(encryptionKey, tmpMasterKey);

      const { status, data } = await apiSetCongregationMasterKey(encryptedKey);

      if (status !== 200) {
        throw new Error(data.message);
      }

      await dbAppSettingsUpdate({
        'cong_settings.cong_master_key': tmpMasterKey,
        'cong_settings.cong_new': true,
      });

      setCurrentStep(2);
    } catch (err) {
      await displayOnboardingFeedback({
        title: t('error_app_generic-title'),
        message: getMessageByCode(err.message),
      });
      showMessage();

      setIsProcessing(false);
    }
  };

  useEffect(() => {
    setIsLengthPassed(tmpMasterKey.length >= 16);
    setIsNumberPassed(/\d/.test(tmpMasterKey));
    setIsLowerCasePassed(/[a-z]/.test(tmpMasterKey));
    setIsUpperCasePassed(/[A-Z]/.test(tmpMasterKey));
    setIsSpecialSymbolPassed(/[!@#$%^&*(),.?"’:{}|<>]/.test(tmpMasterKey));
    setIsMatch(tmpMasterKey.length > 0 && tmpMasterKey === tmpMasterKeyVerify);
  }, [tmpMasterKey, tmpMasterKeyVerify]);

  return {
    handleSetMasterKey,
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
    message,
    title,
    hideMessage,
    variant,
    isMatch,
    btnActionDisabled,
  };
};

export default useCongregationMasterKey;
