import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  congIDState,
  congregationCreateStepState,
  currentProviderState,
  isAuthProcessingState,
  isEncryptionCodeOpenState,
  isUnauthorizedRoleState,
  isUserAccountCreatedState,
  isUserMfaVerifyState,
  isUserSignInState,
  tokenDevState,
  userIDState,
} from '@states/app';
import { setAuthPersistence, userSignInPopup } from '@services/firebase/auth';
import { displayOnboardingFeedback } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { apiSendAuthorization } from '@services/api/user';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { APP_ROLES, VIP_ROLES } from '@constants/index';
import { NextStepType, OAuthButtonBaseProps } from './index.types';
import { UserLoginResponseType } from '@definition/api';
import { settingsState } from '@states/settings';
import useAppTranslation from '@hooks/useAppTranslation';
import useFeedback from '@features/app_start/shared/hooks/useFeedback';

const useButtonBase = ({ provider }: OAuthButtonBaseProps) => {
  const { t } = useAppTranslation();

  const { showMessage, hideMessage } = useFeedback();

  const [isAuthProcessing, setIsAuthProcessing] = useRecoilState(
    isAuthProcessingState
  );

  const setIsUserSignIn = useSetRecoilState(isUserSignInState);
  const setUserMfaVerify = useSetRecoilState(isUserMfaVerifyState);
  const setIsUserAccountCreated = useSetRecoilState(isUserAccountCreatedState);
  const setIsUnauthorizedRole = useSetRecoilState(isUnauthorizedRoleState);
  const setIsEncryptionCodeOpen = useSetRecoilState(isEncryptionCodeOpenState);
  const setTokenDev = useSetRecoilState(tokenDevState);
  const setCurrentStep = useSetRecoilState(congregationCreateStepState);
  const setCongID = useSetRecoilState(congIDState);
  const setUserID = useSetRecoilState(userIDState);

  const settings = useRecoilValue(settingsState);
  const currentProvider = useRecoilValue(currentProviderState);

  const handleAuthorizationError = async (message: string) => {
    await displayOnboardingFeedback({
      title: getMessageByCode('error_app_generic-title'),
      message: getMessageByCode(message),
    });

    showMessage();
    setIsAuthProcessing(false);
  };

  const determineNextStep = ({
    app_settings,
    message,
    id,
  }: UserLoginResponseType): NextStepType => {
    setUserID(id);

    const nextStep: NextStepType = {};

    if (message === 'MFA_VERIFY') {
      nextStep.isVerifyMFA = true;
      return nextStep;
    }

    if (!app_settings) return nextStep;

    const { user_settings, cong_settings } = app_settings;

    if (!cong_settings) {
      nextStep.createCongregation = true;
      return nextStep;
    }

    if (!user_settings.cong_role || user_settings.cong_role?.length === 0) {
      nextStep.unauthorized = true;
      return nextStep;
    }

    const approvedRole = user_settings.cong_role.some((role) =>
      APP_ROLES.includes(role)
    );

    if (!approvedRole) {
      nextStep.unauthorized = true;
      return nextStep;
    }

    const remoteMasterKey = cong_settings.cong_master_key;
    const remoteAccessCode = cong_settings.cong_access_code;
    const masterKeyNeeded = user_settings.cong_role.some((role) =>
      VIP_ROLES.includes(role)
    );

    if (masterKeyNeeded && remoteMasterKey.length === 0) {
      setCongID(cong_settings.id);
      setCurrentStep(1);
      nextStep.createCongregation = true;
      return nextStep;
    }

    if (remoteAccessCode.length === 0) {
      setCongID(cong_settings.id);
      setCurrentStep(2);
      nextStep.createCongregation = true;
      return nextStep;
    }

    nextStep.encryption = true;
    return nextStep;
  };

  const updateUserSettings = async (
    { app_settings, code }: UserLoginResponseType,
    nextStep: NextStepType
  ) => {
    if (app_settings) {
      await dbAppSettingsUpdate({
        'user_settings.account_type': 'vip',
        'user_settings.lastname': app_settings.user_settings.lastname,
        'user_settings.firstname': app_settings.user_settings.firstname,
      });
    }

    if (nextStep.isVerifyMFA) {
      setTokenDev(code);
      setIsUserSignIn(false);
      setIsUserAccountCreated(false);
      setIsUnauthorizedRole(false);
      setUserMfaVerify(true);
    }

    if (nextStep.createCongregation) {
      setIsUserSignIn(false);
      setIsUserAccountCreated(true);
    }

    if (nextStep.encryption) {
      const midweekMeeting = structuredClone(
        settings.cong_settings.midweek_meeting
      );

      for (const midweekRemote of app_settings.cong_settings.midweek_meeting) {
        const midweekLocal = midweekMeeting.find(
          (record) => record.type === midweekRemote.type
        );

        midweekLocal.time = midweekRemote.time;
        midweekLocal.weekday = midweekRemote.weekday;
      }

      const weekendMeeting = structuredClone(
        settings.cong_settings.weekend_meeting
      );

      for (const weekendRemote of app_settings.cong_settings.weekend_meeting) {
        const weekendLocal = weekendMeeting.find(
          (record) => record.type === weekendRemote.type
        );

        weekendLocal.time = weekendRemote.time;
        weekendLocal.weekday = weekendRemote.weekday;
      }

      await dbAppSettingsUpdate({
        'cong_settings.country_code': app_settings.cong_settings.country_code,
        'cong_settings.cong_name': app_settings.cong_settings.cong_name,
        'cong_settings.cong_number': app_settings.cong_settings.cong_number,
        'user_settings.cong_role': app_settings.user_settings.cong_role,
        'cong_settings.cong_location': app_settings.cong_settings.cong_location,
        'cong_settings.cong_circuit': app_settings.cong_settings.cong_circuit,
        'cong_settings.midweek_meeting': midweekMeeting,
        'cong_settings.weekend_meeting': weekendMeeting,
        'cong_settings.cong_new': false,
      });

      setIsUserSignIn(false);
      setIsEncryptionCodeOpen(true);
    }
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
