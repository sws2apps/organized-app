import { useRecoilValue } from 'recoil';
import { currentProviderState, isAuthProcessingState, isUserSignInState, isUserSignUpState } from '@states/app';
import { setAuthPersistence, userSignInPopup } from '@services/firebase/auth';
import { displayOnboardingFeedback, setIsEmailAuth, setIsUserSignIn, setIsUserSignUp } from '@services/recoil/app';
import useAppTranslation from '@hooks/useAppTranslation';
import { useFeedback } from '@features/app_start';
import { getMessageByCode } from '@services/i18n/translation';

const useButtonBase = ({ provider, isEmail }) => {
  const { t } = useAppTranslation();

  const isAuthProcessing = useRecoilValue(isAuthProcessingState);
  const isUserSignIn = useRecoilValue(isUserSignInState);
  const isUserSignUp = useRecoilValue(isUserSignUpState);
  const currentProvider = useRecoilValue(currentProviderState);

  const { showMessage, hideMessage } = useFeedback();

  const handleOAuthAction = async () => {
    if (isAuthProcessing) return;

    hideMessage();

    try {
      await setAuthPersistence();
      await userSignInPopup(provider);
    } catch (error) {
      await displayOnboardingFeedback({
        title: t('errorTitle'),
        message: getMessageByCode(error.code || t('errorGeneric')),
      });

      showMessage();
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

  return { handleAction, isAuthProcessing, currentProvider };
};

export default useButtonBase;
