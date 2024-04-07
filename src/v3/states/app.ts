import { atom, selector } from 'recoil';
import { getShortDatePickerFormat, getTranslation } from '@services/i18n/translation';
import { convertStringToBoolean } from '@utils/common';
import { SnackBarSeverityType } from '@definition/app';
import { ReactElement } from 'react';
import { LANGUAGE_LIST } from '@constants/index';

export const isDarkThemeState = atom({
  key: 'isDarkTheme',
  default: localStorage.getItem('theme') === 'dark' ? true : false,
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

export const isLoginOpenState = atom({
  key: 'isLoginOpen',
  default: false,
});

export const appLangState = atom({
  key: 'appLang',
  default: (typeof window !== 'undefined' && localStorage.getItem('app_lang')) || 'en',
});

export const monthNamesState = selector({
  key: 'monthNames',
  get: ({ get }) => {
    const appLang = get(appLangState);

    const months = [];

    months.push(getTranslation({ key: 'january', language: appLang }));
    months.push(getTranslation({ key: 'february', language: appLang }));
    months.push(getTranslation({ key: 'march', language: appLang }));
    months.push(getTranslation({ key: 'april', language: appLang }));
    months.push(getTranslation({ key: 'may', language: appLang }));
    months.push(getTranslation({ key: 'june', language: appLang }));
    months.push(getTranslation({ key: 'july', language: appLang }));
    months.push(getTranslation({ key: 'august', language: appLang }));
    months.push(getTranslation({ key: 'september', language: appLang }));
    months.push(getTranslation({ key: 'october', language: appLang }));
    months.push(getTranslation({ key: 'november', language: appLang }));
    months.push(getTranslation({ key: 'december', language: appLang }));

    return months;
  },
});

export const shortDateFormatState = selector({
  key: 'shortDateFormat',
  get: ({ get }) => {
    const appLang = get(appLangState);

    return getTranslation({ key: 'shortDateFormat', language: appLang });
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

export const isShowTermsUseState = atom({
  key: 'isShowLAG',
  default: typeof window !== 'undefined' && convertStringToBoolean(localStorage.getItem('termsUse') || 'true'),
});

export const visitorIDState = atom({
  key: 'visitorID',
  default: '',
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

export const currentMFAStageState = atom({
  key: 'currentMFAStage',
  default: 'setup',
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

    const currentLang = LANGUAGE_LIST.find((lang) => lang.locale === appLang);

    return currentLang?.code || 'e';
  },
});
