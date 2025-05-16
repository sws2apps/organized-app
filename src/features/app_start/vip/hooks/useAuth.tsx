import { useAtomValue, useSetAtom } from 'jotai';
import { UserLoginResponseType } from '@definition/api';
import { APP_ROLES, VIP_ROLES } from '@constants/index';
import {
  congIDState,
  congregationCreateStepState,
  isEmailLinkAuthenticateState,
  isEncryptionCodeOpenState,
  isUnauthorizedRoleState,
  isUserAccountCreatedState,
  isUserMfaVerifyState,
  isUserSignInState,
  tokenDevState,
  userIDState,
} from '@states/app';
import { settingsState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { NextStepType } from './index.types';

const useAuth = () => {
  const setIsUserSignIn = useSetAtom(isUserSignInState);
  const setVerifyMFA = useSetAtom(isUserMfaVerifyState);
  const setTokenDev = useSetAtom(tokenDevState);
  const setIsUserAccountCreated = useSetAtom(isUserAccountCreatedState);
  const setIsEmailAuth = useSetAtom(isEmailLinkAuthenticateState);
  const setCurrentStep = useSetAtom(congregationCreateStepState);
  const setCongID = useSetAtom(congIDState);
  const setUserID = useSetAtom(userIDState);
  const setIsUnauthorizedRole = useSetAtom(isUnauthorizedRoleState);
  const setIsEncryptionCodeOpen = useSetAtom(isEncryptionCodeOpenState);

  const settings = useAtomValue(settingsState);

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
      setIsEmailAuth(false);
      setIsUserSignIn(false);
      setIsUserAccountCreated(false);
      setIsUnauthorizedRole(false);
      setVerifyMFA(true);
    }

    if (nextStep.createCongregation) {
      setIsEmailAuth(false);
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

        if (midweekLocal) {
          midweekLocal.time = midweekRemote.time;
          midweekLocal.weekday = midweekRemote.weekday;
        }

        if (!midweekLocal) {
          midweekMeeting.push({
            type: midweekRemote.type,
            _deleted: { value: false, updatedAt: '' },
            aux_class_counselor_default: {
              enabled: { value: false, updatedAt: '' },
              person: { value: '', updatedAt: '' },
            },
            class_count: { value: 1, updatedAt: '' },
            opening_prayer_linked_assignment: {
              value: '',
              updatedAt: '',
            },
            closing_prayer_linked_assignment: {
              value: '',
              updatedAt: '',
            },
            time: midweekRemote.time,
            weekday: midweekRemote.weekday,
          });
        }
      }

      const weekendMeeting = structuredClone(
        settings.cong_settings.weekend_meeting
      );

      for (const weekendRemote of app_settings.cong_settings.weekend_meeting) {
        const weekendLocal = weekendMeeting.find(
          (record) => record.type === weekendRemote.type
        );

        if (weekendLocal) {
          weekendLocal.time = weekendRemote.time;
          weekendLocal.weekday = weekendRemote.weekday;
        }

        if (!weekendLocal) {
          weekendMeeting.push({
            type: weekendRemote.type,
            _deleted: { value: false, updatedAt: '' },
            consecutive_monthly_parts_notice_shown: {
              value: true,
              updatedAt: '',
            },
            opening_prayer_auto_assigned: {
              value: true,
              updatedAt: '',
            },
            outgoing_talks_schedule_public: {
              value: false,
              updatedAt: '',
            },
            substitute_speaker_enabled: {
              value: false,
              updatedAt: '',
            },
            substitute_w_study_conductor_displayed: {
              value: false,
              updatedAt: '',
            },
            w_study_conductor_default: {
              value: '',
              updatedAt: new Date().toISOString(),
            },
            time: weekendRemote.time,
            weekday: weekendRemote.weekday,
          });
        }
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

      setIsEmailAuth(false);
      setIsUserSignIn(false);
      setIsEncryptionCodeOpen(true);
    }
  };

  return { determineNextStep, updateUserSettings };
};

export default useAuth;
