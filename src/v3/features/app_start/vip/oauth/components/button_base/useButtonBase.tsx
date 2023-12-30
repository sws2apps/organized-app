import { useRecoilValue } from 'recoil';
import { currentProviderState, isAuthProcessingState, isUserSignInState } from '@states/app';
import { setAuthPersistence, userSignInPopup } from '@services/firebase/auth';
import {
  displayOnboardingFeedback,
  setCurrentMFAStage,
  setIsAuthProcessing,
  setIsCongAccountCreate,
  setIsEmailAuth,
  setIsEncryptionCodeOpen,
  setIsUnauthorizedRole,
  setIsUserSignIn,
  setUserMfaVerify,
} from '@services/recoil/app';
import useAppTranslation from '@hooks/useAppTranslation';
import { useFeedback } from '@features/app_start';
import { getMessageByCode } from '@services/i18n/translation';
import { apiSendAuthorization } from '@services/api/user';
import { handleUpdateSetting } from '@services/dexie/settings';
import { CPE_ROLES } from '@constants/index';
import { NextStepType } from './index.types';

const useButtonBase = ({ provider, isEmail }) => {
  const { t } = useAppTranslation();

  const isAuthProcessing = useRecoilValue(isAuthProcessingState);
  const isUserSignIn = useRecoilValue(isUserSignInState);
  const currentProvider = useRecoilValue(currentProviderState);

  const { showMessage, hideMessage } = useFeedback();

  const handleOAuthAction = async () => {
    try {
      if (isAuthProcessing) return;

      hideMessage();

      await setAuthPersistence();
      const result = await userSignInPopup(provider);

      if (result) {
        setIsAuthProcessing(true);

        const { status, data } = await apiSendAuthorization();

        if (status !== 200) {
          await displayOnboardingFeedback({
            title: t('trans_errorTitle'),
            message: getMessageByCode(data.message),
          });

          showMessage();

          setIsAuthProcessing(false);
          return;
        }

        const nextStep: NextStepType = {};

        const { cong_name, cong_role, mfa } = data;

        if (mfa === 'not_enabled') {
          if (cong_name.length === 0) {
            nextStep.createCongregation = true;
          }

          if (cong_name.length > 0 && cong_role.length === 0) {
            nextStep.unauthorized = true;
          }

          if (cong_name.length > 0 && cong_role.length > 0) {
            const approvedRole = cong_role.some((role) => CPE_ROLES.includes(role));

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

        if (nextStep.isVerifyMFA || nextStep.encryption || nextStep.createCongregation) {
          await handleUpdateSetting({ account_type: 'vip' });

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
        }

        if (nextStep.unauthorized) {
          setUserMfaVerify(true);
          setIsCongAccountCreate(false);
          setIsUnauthorizedRole(true);
        }

        setIsAuthProcessing(false);
      }
    } catch (error) {
      await displayOnboardingFeedback({
        title: t('trans_errorTitle'),
        message: getMessageByCode(error.code || t('trans_errorGeneric')),
      });

      showMessage();

      setIsAuthProcessing(false);
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
