import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  currentMFAStageState,
  currentProviderState,
  isAuthProcessingState,
  isCongAccountCreateState,
  isEmailAuthState,
  isEncryptionCodeOpenState,
  isUnauthorizedRoleState,
  isUserMfaVerifyState,
  isUserSignInState,
} from '@states/app';
import { setAuthPersistence, userSignInPopup } from '@services/firebase/auth';
import { displayOnboardingFeedback } from '@services/recoil/app';
import useAppTranslation from '@hooks/useAppTranslation';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';
import { getMessageByCode } from '@services/i18n/translation';
import { apiSendAuthorization } from '@services/api/user';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { APP_ROLES } from '@constants/index';
import { NextStepType } from './index.types';
import { UserLoginResponseType } from '@definition/api';

const useButtonBase = ({ provider, isEmail }) => {
  const { t } = useAppTranslation();

  const { showMessage, hideMessage } = useFeedback();

  const [isAuthProcessing, setIsAuthProcessing] = useRecoilState(
    isAuthProcessingState
  );
  const [isUserSignIn, setIsUserSignIn] = useRecoilState(isUserSignInState);

  const setCurrentMFAStage = useSetRecoilState(currentMFAStageState);
  const setUserMfaVerify = useSetRecoilState(isUserMfaVerifyState);
  const setIsCongAccountCreate = useSetRecoilState(isCongAccountCreateState);
  const setIsUnauthorizedRole = useSetRecoilState(isUnauthorizedRoleState);
  const setIsEncryptionCodeOpen = useSetRecoilState(isEncryptionCodeOpenState);
  const setIsEmailAuth = useSetRecoilState(isEmailAuthState);

  const currentProvider = useRecoilValue(currentProviderState);

  const handleAuthorizationError = async (message: string) => {
    await displayOnboardingFeedback({
      title: t('tr_errorTitle'),
      message: getMessageByCode(message),
    });

    showMessage();
    setIsAuthProcessing(false);
  };

  const determineNextStep = (data: UserLoginResponseType): NextStepType => {
    const nextStep: NextStepType = {};

    if (data.mfa === 'not_enabled') {
      if (data.cong_name.length === 0) {
        nextStep.createCongregation = true;
      }

      if (data.cong_name.length > 0 && data.cong_role.length === 0) {
        nextStep.unauthorized = true;
      }

      if (data.cong_name.length > 0 && data.cong_role.length > 0) {
        const approvedRole = data.cong_role.some((role) =>
          APP_ROLES.includes(role)
        );

        if (!approvedRole) {
          nextStep.unauthorized = true;
        }

        if (approvedRole) {
          nextStep.encryption = true;
        }
      }
    } else {
      nextStep.isVerifyMFA = true;
    }

    return nextStep;
  };

  const updateUserSettings = async (
    data: UserLoginResponseType,
    nextStep: NextStepType
  ) => {
    await dbAppSettingsUpdate({
      'user_settings.account_type': 'vip',
      'user_settings.cong_role': data.cong_role,
      'user_settings.lastname': data.lastname,
      'user_settings.firstname': data.firstname,
    });

    if (nextStep.isVerifyMFA) {
      setCurrentMFAStage('verify');
      setUserMfaVerify(true);
      setIsCongAccountCreate(false);
      setIsUnauthorizedRole(false);
    }

    if (nextStep.createCongregation) {
      setIsUserSignIn(false);
      setIsCongAccountCreate(true);
    }

    if (nextStep.encryption) {
      setIsUserSignIn(false);
      setIsEncryptionCodeOpen(true);
    }
  };

  const handleUnauthorizedUser = () => {
    setUserMfaVerify(true);
    setIsCongAccountCreate(false);
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
      await handleAuthorizationError(error.code || t('tr_errorGeneric'));
    }
  };

  const handleEmailAuth = () => {
    setIsEmailAuth(true);
    if (isUserSignIn) setIsUserSignIn(false);
  };

  const handleAction = () => {
    if (isEmail) handleEmailAuth();

    if (!isEmail) handleOAuthAction();
  };

  return { handleAction, isAuthProcessing, currentProvider };
};

export default useButtonBase;
