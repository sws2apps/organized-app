import {
  getAuth,
  indexedDBLocalPersistence,
  setPersistence,
  signInWithPopup,
} from 'firebase/auth';
import { useRecoilState, useSetRecoilState } from 'recoil';
import Dexie from 'dexie';

import {
  congIDCPEState,
  currentProviderCPEState,
  isAuthProcessingCPEState,
  isEmailAuthCPEState,
  isMfaVerifyCPEState,
  migrationStepState,
  tokenDevCPEState,
} from '../../../states/main';
import { apiSendAuthorization } from '../../../api';
import useSnackBar from '../../../hooks/useSnackBar';
import useInsertSettings from '../useInsertSettings';
import appDb from '../../../db';

const useOAuthButtonBase = ({ provider, isEmail }) => {
  const { showMessage } = useSnackBar();

  const { handleInsertSettings } = useInsertSettings();

  const setIsEmailAuth = useSetRecoilState(isEmailAuthCPEState);
  const setTokenDev = useSetRecoilState(tokenDevCPEState);
  const setMfaVerify = useSetRecoilState(isMfaVerifyCPEState);
  const setCurrentStep = useSetRecoilState(migrationStepState);
  const setCongID = useSetRecoilState(congIDCPEState);

  const [currentProvider, setCurrentProvider] = useRecoilState(
    currentProviderCPEState
  );
  const [isAuthProcessing, setIsAuthProcessing] = useRecoilState(
    isAuthProcessingCPEState
  );

  const handleOAuthAction = async () => {
    try {
      setCurrentProvider(provider.providerId);

      const auth = getAuth();
      await setPersistence(auth, indexedDBLocalPersistence);
      await signInWithPopup(auth, provider);

      setIsAuthProcessing(true);

      const data = await apiSendAuthorization();

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

  const handleEmailAuth = () => setIsEmailAuth(true);

  const handleAction = () => {
    if (isAuthProcessing) return;

    if (isEmail) handleEmailAuth();

    if (!isEmail) handleOAuthAction();
  };

  return { handleAction, isAuthProcessing, currentProvider };
};

export default useOAuthButtonBase;
