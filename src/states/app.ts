import { atom, selector } from 'recoil';
import {
  getShortDatePickerFormat,
  getTranslation,
} from '@services/i18n/translation';
import { localStorageGetItem } from '@utils/common';
import { SnackBarSeverityType } from '@definition/app';
import { ReactElement } from 'react';
import { LANGUAGE_LIST } from '@constants/index';
import { CongregationUserType } from '@definition/api';
import { settingsState } from './settings';
import { sourcesState } from './sources';

const getAppLang = () => {
  const langStorage = localStorage.getItem('app_lang');

  if (langStorage) {
    return langStorage;
  }

  const hash = new URL(window.location.href).hash;
  const params = new URLSearchParams(hash.substring(2));

  return params.get('locale')?.toString() || 'en';
};

export const isDarkThemeState = atom({
  key: 'isDarkTheme',
  default: localStorageGetItem('theme') === 'dark' ? true : false,
});

export const offlineOverrideState = atom({
  key: 'offlineOverride',
  default: false,
});

export const isAppLoadState = atom({
  key: 'isAppLoad',
  default: true,
});

export const isSetupState = atom({
  key: 'isSetup',
  default: true,
});

export const apiHostState = atom({
  key: 'apiHost',
  default: '',
});

export const isAboutOpenState = atom({
  key: 'isAboutOpen',
  default: false,
});

export const isContactOpenState = atom({
  key: 'isContactOpen',
  default: false,
});

export const isLoginOpenState = atom({
  key: 'isLoginOpen',
  default: false,
});

export const appLangState = atom({
  key: 'appLang',
  default: getAppLang(),
});

export const monthNamesState = selector({
  key: 'monthNames',
  get: ({ get }) => {
    const appLang = get(appLangState);

    const months: string[] = [];

    months.push(getTranslation({ key: 'tr_january', language: appLang }));
    months.push(getTranslation({ key: 'tr_february', language: appLang }));
    months.push(getTranslation({ key: 'tr_march', language: appLang }));
    months.push(getTranslation({ key: 'tr_april', language: appLang }));
    months.push(getTranslation({ key: 'tr_may', language: appLang }));
    months.push(getTranslation({ key: 'tr_june', language: appLang }));
    months.push(getTranslation({ key: 'tr_july', language: appLang }));
    months.push(getTranslation({ key: 'tr_august', language: appLang }));
    months.push(getTranslation({ key: 'tr_september', language: appLang }));
    months.push(getTranslation({ key: 'tr_october', language: appLang }));
    months.push(getTranslation({ key: 'tr_november', language: appLang }));
    months.push(getTranslation({ key: 'tr_december', language: appLang }));

    return months;
  },
});

export const monthShortNamesState = selector({
  key: 'monthShortNames',
  get: ({ get }) => {
    const appLang = get(appLangState);

    const months: string[] = [];

    months.push(getTranslation({ key: 'tr_januaryShort', language: appLang }));
    months.push(getTranslation({ key: 'tr_februaryShort', language: appLang }));
    months.push(getTranslation({ key: 'tr_marchShort', language: appLang }));
    months.push(getTranslation({ key: 'tr_aprilShort', language: appLang }));
    months.push(getTranslation({ key: 'tr_mayShort', language: appLang }));
    months.push(getTranslation({ key: 'tr_juneShort', language: appLang }));
    months.push(getTranslation({ key: 'tr_julyShort', language: appLang }));
    months.push(getTranslation({ key: 'tr_augustShort', language: appLang }));
    months.push(
      getTranslation({ key: 'tr_septemberShort', language: appLang })
    );
    months.push(getTranslation({ key: 'tr_octoberShort', language: appLang }));
    months.push(getTranslation({ key: 'tr_novemberShort', language: appLang }));
    months.push(getTranslation({ key: 'tr_decemberShort', language: appLang }));

    return months;
  },
});

export const dayNamesState = selector({
  key: 'dayNames',
  get: ({ get }) => {
    const appLang = get(appLangState);

    const days: string[] = [];

    days.push(getTranslation({ key: 'tr_sunday', language: appLang }));
    days.push(getTranslation({ key: 'tr_monday', language: appLang }));
    days.push(getTranslation({ key: 'tr_tuesday', language: appLang }));
    days.push(getTranslation({ key: 'tr_wednesday', language: appLang }));
    days.push(getTranslation({ key: 'tr_thursday', language: appLang }));
    days.push(getTranslation({ key: 'tr_friday', language: appLang }));
    days.push(getTranslation({ key: 'tr_saturday', language: appLang }));

    return days;
  },
});

export const shortDatePickerFormatState = atom({
  key: 'shortDatePickerFormat',
  default: getShortDatePickerFormat(),
});

export const isDeleteDbOpenState = atom({
  key: 'isDeleteDbOpen',
  default: false,
});

export const isUserSignInState = atom({
  key: 'isUserSignIn',
  default: false,
});

export const isEmailNotVerifiedState = atom({
  key: 'isEmailNotVerified',
  default: false,
});

export const isEmailBlockedState = atom({
  key: 'isEmailBlocked',
  default: false,
});

export const isCongAccountCreateState = atom({
  key: 'isCongAccountCreate',
  default: false,
});

export const qrCodePathState = atom({
  key: 'qrCodePath',
  default: '',
});

export const secretTokenPathState = atom({
  key: 'secretTokenPath',
  default: '',
});

export const isOnlineState = atom({
  key: 'isOnline',
  default: navigator.onLine,
});

export const isUserMfaSetupState = atom({
  key: 'isUserMfaSetup',
  default: false,
});

export const isUserMfaVerifyState = atom({
  key: 'isUserMfaVerify',
  default: false,
});

export const isUnauthorizedRoleState = atom({
  key: 'isUnauthorizedRole',
  default: false,
});

export const showReloadState = atom({
  key: 'showReload',
  default: false,
});

export const isWhatsNewOpenState = atom({
  key: 'isWhatsNewOpen',
  default: false,
});

export const rootModalOpenState = atom({
  key: 'rootModalOpen',
  default: false,
});

export const backupDbOpenState = atom({
  key: 'backupDbOpen',
  default: false,
});

export const restoreDbOpenState = atom({
  key: 'restoreDbOpen',
  default: false,
});

export const userIDState = atom({
  key: 'userID',
  default: '',
});

export const isReEnrollMFAState = atom({
  key: 'isReEnrollMFA',
  default: false,
});

export const isMyAssignmentOpenState = atom({
  key: 'isMyAssignmentOpen',
  default: false,
});

export const refreshMyAssignmentsState = atom({
  key: 'refreshMyAssignments',
  default: false,
});

export const isCongPersonAddState = atom({
  key: 'isCongPersonAdd',
  default: false,
});

export const isEmailAuthState = atom({
  key: 'isEmailAuth',
  default: false,
});

export const isAuthProcessingState = atom({
  key: 'isAuthProcessing',
  default: false,
});

export const isOAuthAccountUpgradeState = atom({
  key: 'isOAuthAccountUpgrade',
  default: false,
});

export const userEmailState = atom({
  key: 'userEmail',
  default: '',
});

export const userConfirmationOpenState = atom({
  key: 'userConfirmationOpen',
  default: false,
});

export const userConfirmationTitleState = atom({
  key: 'userConfirmationTitle',
  default: false,
});

export const userConfirmationMessageState = atom({
  key: 'userConfirmationMessage',
  default: false,
});

export const userConfirmationActionState = atom({
  key: 'userConfirmationAction',
  default: undefined,
});

export const isAccountChooseState = atom({
  key: 'isAccountChoose',
  default: false,
});

export const isFetchingScheduleState = atom({
  key: 'isFetchingSchedule',
  default: true,
});

export const refreshScreenState = atom({
  key: 'refreshScreen',
  default: false,
});

export const isEmailLinkAuthenticateState = atom({
  key: 'isEmailLinkAuthenticate',
  default: false,
});

export const appSnackOpenState = atom({
  key: 'appSnackOpen',
  default: false,
});

export const appSeverityState = atom<SnackBarSeverityType>({
  key: 'appSeverity',
  default: 'success',
});

export const appMessageState = atom({
  key: 'appMessage',
  default: '',
});

export const appMessageHeaderState = atom({
  key: 'appMessageHeader',
  default: '',
});

export const appMessageIconState = atom<ReactElement | null>({
  key: 'appMessageIcon',
  default: null,
});

export const congAccountConnectedState = atom({
  key: 'congAccountConnected',
  default: false,
});

export const themeOptionsState = selector({
  key: 'themeOptions',
  get: ({ get }) => {
    const isLight = get(isDarkThemeState);

    return {
      mainColor: '#3f51b5 !important',
      textNotImportant: isLight ? '#707B7C' : '#D0D3D4',
      reportIconColor: isLight ? '#CB4335' : '#FDFEFE',
      redNoteBg: isLight ? '#F5B7B1' : '#E74C3C',
      whatsNewBg: isLight ? '#AEB6BF' : '#2C3E50',
      whatsNewBgSecondary: isLight ? '#F4F6F6' : '#1C2833',
      btnProgress: isLight ? '#212F3D' : '#FBFCFC',
      searchBg: isLight ? 'black' : 'white',
      fsgHeadingColor: '#004d40 !important',
    };
  },
});

export const pendingFieldServiceReportsState = atom({
  key: 'pendingFieldServiceReports',
  default: [],
});

export const pendingFieldServiceReportsCountState = selector({
  key: 'pendingFieldServiceReportsCount',
  get: ({ get }) => {
    const pendingReports = get(pendingFieldServiceReportsState);
    return pendingReports.length;
  },
});

export const congSpeakersRequestsState = atom({
  key: 'congSpeakersRequests',
  default: [],
});

export const congSpeakersRequestsStateCountState = selector({
  key: 'congSpeakersRequestsStateCount',
  get: ({ get }) => {
    const requests = get(congSpeakersRequestsState);
    return requests.length;
  },
});

export const congSpeakersRequestsUpdateState = atom({
  key: 'congSpeakersRequestsUpdate',
  default: [],
});

export const congSpeakersRequestsUpdateCountState = selector({
  key: 'congSpeakersRequestsUpdateCount',
  get: ({ get }) => {
    const requests = get(congSpeakersRequestsUpdateState);
    return requests.length;
  },
});

export const congIDState = atom({
  key: 'congID',
  default: '',
});

export const currentProviderState = atom({
  key: 'currentProvider',
  default: '',
});

export const onboardingTitleState = atom({
  key: 'onboardingTitle',
  default: '',
});

export const onboardingMessageState = atom({
  key: 'onboardingMessage',
  default: '',
});

export const onboardingVariantState = atom({
  key: 'onboardingVariant',
  default: 'error' as 'error' | 'success' | 'message-with-button',
});

export const isSupportOpenState = atom({
  key: 'isSupportOpen',
  default: false,
});

export const isNewCongregationState = atom({
  key: 'isNewCongregation',
  default: false,
});

export const isEncryptionCodeOpenState = atom({
  key: 'isEncryptionCodeOpen',
  default: false,
});

export const isAppDataSyncingState = atom({
  key: 'isAppDataSyncing',
  default: false,
});

export const lastAppDataSyncState = atom({
  key: 'lastAppDataSync',
  default: undefined,
});

export const isMFAEnabledState = atom({
  key: 'isMFAEnabled',
  default: false,
});

export const JWLangState = selector({
  key: 'JWLang',
  get: ({ get }) => {
    const appLang = get(appLangState);
    const settings = get(settingsState);
    const sources = get(sourcesState);

    const userRole = settings.user_settings.cong_role;

    const isAdmin = userRole.some(
      (role) =>
        role === 'admin' || role === 'coordinator' || role === 'secretary'
    );

    const isMidweekEditor = isAdmin || userRole.includes('midweek_schedule');
    const isWeekendEditor = isAdmin || userRole.includes('weekend_schedule');
    const isMeetingEditor = isMidweekEditor || isWeekendEditor;

    if (!isMeetingEditor) {
      const source = sources.at(0);

      if (source) {
        const keys = Object.keys(source.midweek_meeting.weekly_bible_reading);
        return keys.at(0);
      }

      if (!source) {
        return 'E';
      }
    }

    const currentLang = LANGUAGE_LIST.find((lang) => lang.locale === appLang);

    return currentLang?.code.toUpperCase() || 'E';
  },
});

export const currentDrawerState = atom({
  key: 'currentDrawer',
  default: '',
});

export const isAppNotificationOpenState = atom({
  key: 'isAppNotificationOpen',
  default: false,
});

export const speakersKeyState = atom({
  key: 'speakersKey',
  default: '',
});

export const encryptedMasterKeyState = atom({
  key: 'encryptedMasterKey',
  default: '',
});

export const cookiesConsentState = atom({
  key: 'cookiesConsent',
  default: Boolean(localStorageGetItem('userConsent')),
});

export const tokenDevState = atom({
  key: 'tokenDev',
  default: '',
});

export const congregationUsersState = atom<CongregationUserType[]>({
  key: 'congregationUsers',
  default: [],
});

export const congregationsPersonsState = selector({
  key: 'congregationsPersons',
  get: ({ get }) => {
    const users = get(congregationUsersState);

    return users.filter((record) => record.profile.global_role === 'pocket');
  },
});

export const congregationsAppAdminState = selector({
  key: 'congregationsAppAdmin',
  get: ({ get }) => {
    const users = get(congregationUsersState);

    return users.filter((record) => record.profile.cong_role.includes('admin'));
  },
});

export const congregationsBaptizedPersonsState = selector({
  key: 'congregationsBaptizedPersons',
  get: ({ get }) => {
    const users = get(congregationUsersState);

    return users.filter(
      (record) =>
        record.profile.global_role === 'vip' &&
        !record.profile.cong_role.includes('admin') &&
        !record.profile.cong_role.includes('coordinator')
    );
  },
});

export const demoNoticeOpenState = atom({
  key: 'demoNoticeOpen',
  default: true,
});
