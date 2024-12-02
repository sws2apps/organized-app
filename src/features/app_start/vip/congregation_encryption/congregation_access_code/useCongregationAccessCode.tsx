import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { handleDeleteDatabase, loadApp, runUpdater } from '@services/app';
import { useAppTranslation, useFirebaseAuth } from '@hooks/index';
import { userSignOut } from '@services/firebase/auth';
import { decryptData } from '@services/encryption/index';
import { apiValidateMe } from '@services/api/user';
import { displayOnboardingFeedback, setCongID } from '@services/recoil/app';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { congNumberState } from '@states/settings';
import { isAppLoadState, isSetupState } from '@states/app';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';

const useCongregationAccessCode = () => {
  const { t } = useAppTranslation();

  const { isAuthenticated } = useFirebaseAuth();

  const { hideMessage, message, showMessage, title, variant } = useFeedback();

  const setIsSetup = useSetRecoilState(isSetupState);
  const setIsAppLoad = useSetRecoilState(isAppLoadState);

  const congNumber = useRecoilValue(congNumberState);

  const [isLoading, setIsLoading] = useState(true);
  const [tmpAccessCode, setTmpAccessCode] = useState('');
  const [tmpAccessCodeVerify, setTmpAccessCodeVerify] = useState('');
  const [isLengthPassed, setIsLengthPassed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [congAccessCode, setCongAccessCode] = useState('');

  const btnActionDisabled = !isLengthPassed;

  const handleValidateAccessCode = async () => {
    if (isProcessing) return;
    hideMessage();
    setIsProcessing(true);

    try {
      decryptData(congAccessCode, tmpAccessCode);

      await dbAppSettingsUpdate({
        'cong_settings.cong_access_code': tmpAccessCode,
      });

      setIsSetup(false);
      await loadApp();
      await runUpdater();
      setTimeout(() => {
        setIsAppLoad(false);
      }, 1000);
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

      setIsLoading(false);
    };

    if (isAuthenticated) getAccessCode();
  }, [isAuthenticated, congNumber]);

  useEffect(() => {
    setIsLengthPassed(tmpAccessCode.length >= 8);
  }, [tmpAccessCode, tmpAccessCodeVerify]);

  return {
    isLoading,
    tmpAccessCode,
    setTmpAccessCode,
    isLengthPassed,
    isProcessing,
    handleValidateAccessCode,
    message,
    title,
    hideMessage,
    variant,
    setTmpAccessCodeVerify,
    tmpAccessCodeVerify,
    btnActionDisabled,
  };
};

export default useCongregationAccessCode;
