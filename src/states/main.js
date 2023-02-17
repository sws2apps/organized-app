import { atom, selector } from 'recoil';
import { getI18n } from 'react-i18next';
import { LANGUAGE_LIST } from '../locales/langList';

export const isLightThemeState = atom({
  key: 'isLightTheme',
  default: localStorage.getItem('theme') ? (localStorage.getItem('theme') === 'dark' ? false : true) : true,
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
  default: localStorage.getItem('app_lang') || 'e',
});

export const uidUserState = atom({
  key: 'uidUser',
  default: '',
});

export const isCongConnectedState = atom({
  key: 'isCongConnected',
  default: false,
});

export const userPasswordState = atom({
  key: 'userPassowrd',
  default: '',
});

export const monthNamesState = selector({
  key: 'monthNames',
  get: ({ get }) => {
    const appLang = get(appLangState);

    let months = [];
    months.push(getI18n().getDataByLanguage(appLang).ui['january']);
    months.push(getI18n().getDataByLanguage(appLang).ui['february']);
    months.push(getI18n().getDataByLanguage(appLang).ui['march']);
    months.push(getI18n().getDataByLanguage(appLang).ui['april']);
    months.push(getI18n().getDataByLanguage(appLang).ui['may']);
    months.push(getI18n().getDataByLanguage(appLang).ui['june']);
    months.push(getI18n().getDataByLanguage(appLang).ui['july']);
    months.push(getI18n().getDataByLanguage(appLang).ui['august']);
    months.push(getI18n().getDataByLanguage(appLang).ui['september']);
    months.push(getI18n().getDataByLanguage(appLang).ui['october']);
    months.push(getI18n().getDataByLanguage(appLang).ui['november']);
    months.push(getI18n().getDataByLanguage(appLang).ui['december']);

    return months;
  },
});

export const shortDateFormatState = selector({
  key: 'shortDateFormat',
  get: ({ get }) => {
    const appLang = get(appLangState);
    const format = getI18n().getDataByLanguage(appLang).ui['shortDateFormat'];
    return format;
  },
});

export const shortDatePickerFormatState = selector({
  key: 'shortDatePickerFormat',
  get: ({ get }) => {
    const appLang = get(appLangState);
    const format = getI18n().getDataByLanguage(appLang).ui['shortDatePickerFormat'];
    return format;
  },
});

export const isDeleteDbOpenState = atom({
  key: 'isDeleteDbOpen',
  default: false,
});

export const isBackupDbOpenState = atom({
  key: 'isBackupDbOpen',
  default: false,
});

export const isBackupOfflineState = atom({
  key: 'isBackupOffline',
  default: false,
});

export const isBackupOnlineState = atom({
  key: 'isBackupOnline',
  default: false,
});

export const isRestoreOfflineState = atom({
  key: 'isRestoreOffline',
  default: false,
});

export const isRestoreOnlineState = atom({
  key: 'isRestoreOnline',
  default: false,
});

export const backupEncryptedState = atom({
  key: 'backupEncrypted',
  default: {},
});

export const backupJsonDataState = atom({
  key: 'backupJsonData',
  default: undefined,
});

export const isUserLoggedState = atom({
  key: 'isUserLogged',
  default: false,
});

export const isCongLoginOpenState = atom({
  key: 'isCongLoginOpen',
  default: false,
});

export const isCongCreateAccountState = atom({
  key: 'isCongCreateAccount',
  default: false,
});

export const isCongSignInState = atom({
  key: 'isCongSignIn',
  default: false,
});

export const isCongUpdateAccountState = atom({
  key: 'isCongUpdateAccount',
  default: false,
});

export const isUserSignInState = atom({
  key: 'isUserSignIn',
  default: false,
});

export const isUserSignUpState = atom({
  key: 'isUserSignUp',
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
  default: localStorage.getItem('termsUse') === 'false' ? false : true,
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

export const isPrecachedState = atom({
  key: 'isPrecached',
  default: false,
});

export const showReloadState = atom({
  key: 'showReload',
  default: false,
});

export const waitingWorkerState = atom({
  key: 'waitingWorker',
  default: null,
});

export const isWhatsNewOpenState = atom({
  key: 'isWhatsNewOpen',
  default: false,
});

export const appNotificationsState = atom({
  key: 'appNotifications',
  default: [],
});

export const countNotificationsState = selector({
  key: 'countNotifications',
  get: ({ get }) => {
    const announcements = get(appNotificationsState);
    const appLang = get(appLangState);
    const fldKey = LANGUAGE_LIST.find((language) => language.code === appLang).locale;

    let count = 0;
    for (const announcement of announcements) {
      const findTitleIndex = announcement.title.findIndex((item) => item.language === fldKey);
      let isRead = announcement.title[findTitleIndex].isRead;

      if (isRead) {
        const findBodyIndex = announcement.body.findIndex((item) => item.language === fldKey);
        isRead = announcement.body[findBodyIndex].isRead;
      }

      if (!isRead) count++;
    }

    return count;
  },
});

export const currentNotificationState = atom({
  key: 'currentNotification',
  default: {},
});

export const startupProgressState = atom({
  key: 'startupProgress',
  default: 0,
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

export const userLocalUidState = atom({
  key: 'userLocalUid',
  default: '',
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

export const sourceLangState = atom({
  key: 'sourceLang',
  default: 'e',
});

export const isEmailAuthState = atom({
  key: 'isEmailAuth',
  default: false,
});

export const isAuthProcessingState = atom({
  key: 'isAuthProcessing',
  default: false,
});

export const avatarUrlState = atom({
  key: 'avatarUrl',
  default: undefined,
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
