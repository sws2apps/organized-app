import { useEffect, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { handleDeleteDatabase, loadApp, runUpdater } from '@services/app';
import { useAppTranslation, useFirebaseAuth } from '@hooks/index';
import { userSignOut } from '@services/firebase/auth';
import { decryptData } from '@services/encryption/index';
import { apiValidateMe } from '@services/api/user';
import { displayOnboardingFeedback } from '@services/states/app';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { isAppLoadState, isSetupState } from '@states/app';
import { congIDState } from '@states/settings';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';

const useCongregationAccessCode = () => {
  const { t } = useAppTranslation();

  const { isAuthenticated } = useFirebaseAuth();

  const { hideMessage, message, showMessage, title, variant } = useFeedback();

  const setIsSetup = useSetAtom(isSetupState);
  const setIsAppLoad = useSetAtom(isAppLoadState);

  const congID = useAtomValue(congIDState);

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
      decryptData(congAccessCode, tmpAccessCode, 'access_code');

      await dbAppSettingsUpdate({
        'cong_settings.cong_access_code': tmpAccessCode,
      });

      setIsSetup(false);
      await runUpdater();
      loadApp();
      setTimeout(() => {
        setIsAppLoad(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      displayOnboardingFeedback({
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
        if (congID.length > 0 && result.cong_id !== congID) {
          await handleDeleteDatabase();
          return;
        }
      }

      setCongAccessCode(result.cong_access_code);

      setIsLoading(false);
    };

    if (isAuthenticated) getAccessCode();
  }, [isAuthenticated, congID]);

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
