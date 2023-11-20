import { useRecoilValue } from 'recoil';
import { isAuthProcessingState, isUserSignInState, isUserSignUpState, visitorIDState } from '@states/app';
import { setAuthPersistence, userSignInPopup } from '@services/firebase/auth';
import { displaySnackNotification, setIsEmailAuth, setIsUserSignIn, setIsUserSignUp } from '@services/recoil/app';
import useAppTranslation from '@hooks/useAppTranslation';

const useButtonBase = ({ provider, isEmail }) => {
  const { t } = useAppTranslation();

  const isAuthProcessing = useRecoilValue(isAuthProcessingState);
  const visitorID = useRecoilValue(visitorIDState);
  const isUserSignIn = useRecoilValue(isUserSignInState);
  const isUserSignUp = useRecoilValue(isUserSignUpState);

  const handleOAuthAction = async () => {
    try {
      await setAuthPersistence();
      await userSignInPopup(provider);
    } catch (error) {
      if (error.code && error.code === 'auth/account-exists-with-different-credential') {
        await displaySnackNotification({
          message: t('oauthAccountExistsWithDifferentCredential'),
          severity: 'warning',
        });

        return;
      }

      await displaySnackNotification({
        message: t('oauthError'),
        severity: 'error',
      });
    }
  };

  const handleEmailAuth = () => {
    setIsEmailAuth(true);
    if (isUserSignIn) setIsUserSignIn(false);
    if (isUserSignUp) setIsUserSignUp(false);
  };

  const handleAction = () => {
    if (isEmail) handleEmailAuth();

    if (!isEmail) handleOAuthAction();
  };

  return { handleAction, isAuthProcessing, visitorID };
};

export default useButtonBase;
