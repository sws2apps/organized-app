import { useRecoilValue } from 'recoil';
import { currentProviderState, isAuthProcessingState, isUserSignInState, isUserSignUpState } from '@states/app';
import { setAuthPersistence, userSignInPopup } from '@services/firebase/auth';
import {
  displayOnboardingFeedback,
  setCongAccountConnected,
  setCurrentMFAStage,
  setIsAppLoad,
  setIsAuthProcessing,
  setIsCongAccountCreate,
  setIsEmailAuth,
  setIsSetup,
  setIsUnauthorizedRole,
  setIsUserSignIn,
  setIsUserSignUp,
  setRootModalOpen,
  setUserMfaVerify,
} from '@services/recoil/app';
import useAppTranslation from '@hooks/useAppTranslation';
import { useFeedback } from '@features/app_start';
import { getMessageByCode } from '@services/i18n/translation';
import { apiSendAuthorization } from '@services/api/user';
import { CPE_ROLES } from '@constants/index';
import { runUpdater, updateUserInfoAfterLogin } from '@services/cpe';
import { handleUpdateSetting } from '@services/dexie/settings';
import { apiFetchSchedule } from '@services/api/schedule';
import { handleUpdateScheduleFromRemote } from '@services/cpe/schedules';

const useButtonBase = ({ provider, isEmail }) => {
  const { t } = useAppTranslation();

  const isAuthProcessing = useRecoilValue(isAuthProcessingState);
  const isUserSignIn = useRecoilValue(isUserSignInState);
  const isUserSignUp = useRecoilValue(isUserSignUpState);
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
            title: t('errorTitle'),
            message: getMessageByCode(data.message),
          });

          showMessage();

          setIsAuthProcessing(false);
          return;
        }

        const result = {};
        const { cong_name, cong_role, mfa } = data;

        if (mfa === 'not_enabled') {
          if (cong_name.length === 0) {
            result.createCongregation = true;
          }

          if (cong_name.length > 0 && cong_role.length === 0) {
            result.unauthorized = true;
          }

          if (cong_name.length > 0 && cong_role.length > 0) {
            const approvedRole = cong_role.some((role) => CPE_ROLES.includes(role));

            if (!approvedRole) {
              result.unauthorized = true;
            }

            if (approvedRole) {
              await updateUserInfoAfterLogin(data);

              result.success = true;
            }
          }
        } else {
          result.isVerifyMFA = true;
        }

        if (result.isVerifyMFA || result.success || result.createCongregation) {
          await handleUpdateSetting({ account_type: 'vip' });

          if (result.isVerifyMFA) {
            setCurrentMFAStage('verify');
            setIsUserSignUp(false);
            setUserMfaVerify(true);
            setIsCongAccountCreate(false);
            setIsUnauthorizedRole(false);
          }

          if (result.success) {
            setIsSetup(false);

            await runUpdater();

            await setRootModalOpen(true);
            const { status: scheduleStatus, data: scheduleData } = await apiFetchSchedule();
            if (scheduleStatus === 200) {
              await handleUpdateScheduleFromRemote(scheduleData);
            }
            await setRootModalOpen(false);

            setTimeout(() => {
              setCongAccountConnected(true);
              setIsAppLoad(false);
            }, [2000]);
          }

          if (result.createCongregation) {
            setIsUserSignUp(false);
            setIsUserSignIn(false);
            setIsCongAccountCreate(true);
          }
        }

        if (result.unauthorized) {
          setIsUserSignUp(false);
          setUserMfaVerify(true);
          setIsCongAccountCreate(false);
          setIsUnauthorizedRole(true);
        }

        setIsAuthProcessing(false);
      }
    } catch (error) {
      await displayOnboardingFeedback({
        title: t('errorTitle'),
        message: getMessageByCode(error.code || t('errorGeneric')),
      });

      showMessage();

      setIsAuthProcessing(false);
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
