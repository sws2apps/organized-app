import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { encryptData, generateKey } from '@services/encryption/index';
import { displayOnboardingFeedback } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { apiSetCongregationAccessCode } from '@services/api/congregation';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { isAppLoadState, isSetupState } from '@states/app';
import { loadApp, runUpdater } from '@services/app';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';

const useCongregationAccessCode = () => {
  const { t } = useAppTranslation();

  const { hideMessage, message, showMessage, title, variant } = useFeedback();

  const setIsSetup = useSetRecoilState(isSetupState);
  const setIsAppLoad = useSetRecoilState(isAppLoadState);

  const [tmpAccessCode, setTmpAccessCode] = useState('');
  const [tmpAccessCodeVerify, setTmpAccessCodeVerify] = useState('');
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
          title: t('error_app_generic-title'),
          message: getMessageByCode(data.message),
        });
        showMessage();

        setIsProcessing(false);
        return;
      }

      await dbAppSettingsUpdate({
        'cong_settings.cong_access_code': tmpAccessCode,
        'cong_settings.cong_new': true,
      });

      setIsSetup(false);
      await loadApp();
      await runUpdater();
      setTimeout(() => {
        setIsAppLoad(false);
      }, 1000);
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
    tmpAccessCode,
    setTmpAccessCode,
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
    setTmpAccessCodeVerify,
    tmpAccessCodeVerify,
    btnActionDisabled,
    handleSetAccessCode,
  };
};

export default useCongregationAccessCode;
