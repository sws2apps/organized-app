import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  currentProviderState,
  isAuthProcessingState,
  isUnauthorizedRoleState,
  isUserAccountCreatedState,
  isUserMfaVerifyState,
} from '@states/app';
import { setAuthPersistence, userSignInPopup } from '@services/firebase/auth';
import { displayOnboardingFeedback } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { apiSendAuthorization } from '@services/api/user';
import { NextStepType, OAuthButtonBaseProps } from './index.types';
import { UserLoginResponseType } from '@definition/api';
import useAppTranslation from '@hooks/useAppTranslation';
import useAuth from '../../hooks/useAuth';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';

const useButtonBase = ({ provider }: OAuthButtonBaseProps) => {
  const { t } = useAppTranslation();

  const { showMessage, hideMessage } = useFeedback();

  const { determineNextStep, updateUserSettings } = useAuth();

  const [isAuthProcessing, setIsAuthProcessing] = useAtom(
    isAuthProcessingState
  );

  const setUserMfaVerify = useSetAtom(isUserMfaVerifyState);
  const setIsUserAccountCreated = useSetAtom(isUserAccountCreatedState);
  const setIsUnauthorizedRole = useSetAtom(isUnauthorizedRoleState);

  const currentProvider = useAtomValue(currentProviderState);

  const handleAuthorizationError = async (message: string) => {
    displayOnboardingFeedback({
      title: getMessageByCode('error_app_generic-title'),
      message: getMessageByCode(message),
    });

    showMessage();
    setIsAuthProcessing(false);
  };

  const handleUnauthorizedUser = () => {
    setUserMfaVerify(true);
    setIsUserAccountCreated(false);
    setIsUnauthorizedRole(true);
  };

  const handleOAuthAction = async () => {
    try {
      if (isAuthProcessing) return;

      hideMessage();

      await setAuthPersistence();
      const result = await userSignInPopup(provider);

      if (!result) return;

      setIsAuthProcessing(true);

      const { status, data } = await apiSendAuthorization();

      if (status !== 200) {
        await handleAuthorizationError(data.message);
        return;
      }

      const nextStep: NextStepType = determineNextStep(
        data as UserLoginResponseType
      );

      if (
        nextStep.isVerifyMFA ||
        nextStep.encryption ||
        nextStep.createCongregation
      ) {
        await updateUserSettings(data as UserLoginResponseType, nextStep);
      }

      if (nextStep.unauthorized) {
        handleUnauthorizedUser();
      }

      setIsAuthProcessing(false);
    } catch (error) {
      console.error(error);
      await handleAuthorizationError(
        error.code || error.message || t('error_app_generic-desc')
      );
    }
  };

  return { handleOAuthAction, isAuthProcessing, currentProvider };
};

export default useButtonBase;
