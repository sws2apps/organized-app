import { useSearchParams } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  getAuth,
  indexedDBLocalPersistence,
  setPersistence,
  signInWithCustomToken,
} from 'firebase/auth';
import { useMediaQuery, useTheme } from '@mui/material';
import Dexie from 'dexie';

import {
  congIDCPEState,
  isAuthProcessingCPEState,
  isEmailAuthCPEState,
  isMfaVerifyCPEState,
  migrationStepState,
  tokenDevCPEState,
} from '../../../states/main';
import { apiUpdatePasswordlessInfo } from '../../../api';
import useInsertSettings from '../useInsertSettings';
import useSnackBar from '../../../hooks/useSnackBar';
import appDb from '../../../db';

const useEmailLinkAuthentication = () => {
  const theme = useTheme();

  const tabletUp = useMediaQuery(theme.breakpoints.up('tablet'), {
    noSsr: true,
  });

  const { showMessage } = useSnackBar();

  const { handleInsertSettings } = useInsertSettings();

  const [searchParams, setSearchParams] = useSearchParams();

  const setEmailAuth = useSetRecoilState(isEmailAuthCPEState);
  const setCurrentStep = useSetRecoilState(migrationStepState);
  const setTokenDev = useSetRecoilState(tokenDevCPEState);
  const setMfaVerify = useSetRecoilState(isMfaVerifyCPEState);
  const setCongID = useSetRecoilState(congIDCPEState);

  const [isAuthProcessing, setIsAuthProcessing] = useRecoilState(
    isAuthProcessingCPEState
  );

  const handleBack = () => {
    setSearchParams('');
    setEmailAuth(true);
  };

  const handleLogin = async () => {
    if (isAuthProcessing) return;

    const code = searchParams.get('code');

    if (!code || code?.length === 0) return;

    try {
      const auth = getAuth();
      await setPersistence(auth, indexedDBLocalPersistence);

      await signInWithCustomToken(auth, code);

      setIsAuthProcessing(true);

      const data = await apiUpdatePasswordlessInfo();
      localStorage.removeItem('emailForSignIn');

      setSearchParams('');

      setIsAuthProcessing(false);

      if (data.message === 'MFA_VERIFY') {
        setTokenDev(data.code);
        setMfaVerify(true);

        return;
      }

      if (!data.app_settings.cong_settings) {
        setCurrentStep(3);
        return;
      }

      const isAdmin =
        data.app_settings.user_settings.cong_role.includes('admin');

      if (!isAdmin) {
        await appDb.close();
        await Dexie.delete('cpe_sws');

        window.location.href = '/';
        return;
      }

      await handleInsertSettings(data.app_settings);

      setCongID(data.app_settings.cong_settings.id);
      setCurrentStep(1);
    } catch (error) {
      setIsAuthProcessing(false);
      showMessage(error.message, 'error');
    }
  };

  return { tabletUp, handleBack, handleLogin, isAuthProcessing };
};

export default useEmailLinkAuthentication;
