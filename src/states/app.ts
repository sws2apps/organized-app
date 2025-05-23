import { ReactElement } from 'react';
import { atom } from 'jotai';
import {
  getShortDatePickerFormat,
  getTranslation,
} from '@services/i18n/translation';
import { localStorageGetItem } from '@utils/common';
import { BackupFileType, SnackBarSeverityType } from '@definition/app';
import { CongregationUserType } from '@definition/api';

export const isDarkThemeState = atom(localStorageGetItem('theme') === 'dark');

export const offlineOverrideState = atom(false);

export const isAppLoadState = atom(true);

export const isSetupState = atom(true);

export const apiHostState = atom('');

export const isAboutOpenState = atom(false);

export const isContactOpenState = atom(false);

export const isLoginOpenState = atom(false);

export const appLangState = atom(localStorageGetItem('ui_lang'));

export const monthNamesState = atom((get) => {
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
});

export const monthShortNamesState = atom((get) => {
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
  months.push(getTranslation({ key: 'tr_septemberShort', language: appLang }));
  months.push(getTranslation({ key: 'tr_octoberShort', language: appLang }));
  months.push(getTranslation({ key: 'tr_novemberShort', language: appLang }));
  months.push(getTranslation({ key: 'tr_decemberShort', language: appLang }));

  return months;
});

export const dayNamesState = atom((get) => {
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
});

export const shortDatePickerFormatState = atom(getShortDatePickerFormat());

export const isDeleteDbOpenState = atom(false);

export const isUserSignInState = atom(false);

export const isEmailNotVerifiedState = atom(false);

export const isEmailBlockedState = atom(false);

export const isUserAccountCreatedState = atom(false);

export const isCongAccountCreateState = atom(false);

export const qrCodePathState = atom('');

export const secretTokenPathState = atom('');

export const isOnlineState = atom(navigator.onLine);

export const isUserMfaSetupState = atom(false);

export const isUserMfaVerifyState = atom(false);

export const isUnauthorizedRoleState = atom(false);

export const showReloadState = atom(false);

export const isWhatsNewOpenState = atom(false);

export const rootModalOpenState = atom(false);

export const backupDbOpenState = atom(false);

export const restoreDbOpenState = atom(false);

export const userIDState = atom('');

export const isReEnrollMFAState = atom(false);

export const isMyAssignmentOpenState = atom(false);

export const refreshMyAssignmentsState = atom(false);

export const isCongPersonAddState = atom(false);

export const isAuthProcessingState = atom(false);

export const isOAuthAccountUpgradeState = atom(false);

export const userEmailState = atom('');

export const userConfirmationOpenState = atom(false);

export const userConfirmationTitleState = atom('');

export const userConfirmationMessageState = atom('');

export const isAccountChooseState = atom(false);

export const isFetchingScheduleState = atom(true);

export const refreshScreenState = atom(false);

export const isEmailLinkAuthenticateState = atom(false);

export const appSnackOpenState = atom(false);

export const appSeverityState = atom<SnackBarSeverityType>('success');

export const appMessageState = atom('');

export const appMessageHeaderState = atom('');

export const appMessageIconState = atom<ReactElement>(null as ReactElement);

export const congAccountConnectedState = atom(false);

export const themeOptionsState = atom((get) => {
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
});

export const pendingFieldServiceReportsState = atom([]);

export const pendingFieldServiceReportsCountState = atom((get) => {
  const pendingReports = get(pendingFieldServiceReportsState);
  return pendingReports.length;
});

export const congSpeakersRequestsState = atom([]);

export const congSpeakersRequestsStateCountState = atom((get) => {
  const requests = get(congSpeakersRequestsState);
  return requests.length;
});

export const congSpeakersRequestsUpdateState = atom([]);

export const congSpeakersRequestsUpdateCountState = atom((get) => {
  const requests = get(congSpeakersRequestsUpdateState);
  return requests.length;
});

export const congIDState = atom('');

export const currentProviderState = atom('');

export const onboardingTitleState = atom('');

export const onboardingMessageState = atom('');

export const onboardingVariantState = atom(
  'error' as 'error' | 'success' | 'message-with-button'
);

export const isSupportOpenState = atom(false);

export const isNewCongregationState = atom(false);

export const isEncryptionCodeOpenState = atom(false);

export const isAppDataSyncingState = atom(false);

export const lastAppDataSyncState = atom<number | string>(0);

export const isMFAEnabledState = atom(false);

export const currentDrawerState = atom('');

export const isAppNotificationOpenState = atom(false);

export const speakersKeyState = atom('');

export const encryptedMasterKeyState = atom('');

export const encryptedAccessCodeState = atom('');

export const cookiesConsentState = atom(
  Boolean(localStorageGetItem('userConsent'))
);

export const tokenDevState = atom('');

export const congregationUsersState = atom<CongregationUserType[]>([]);

export const congregationsPersonsState = atom((get) => {
  const users = get(congregationUsersState);

  return users.filter((record) => record.profile.global_role === 'pocket');
});

export const congregationsAppAdminState = atom((get) => {
  const users = get(congregationUsersState);

  return users.filter((record) => {
    const roles = record.profile.cong_role || [];
    const admins = ['admin', 'coordinator', 'secretary'];

    return roles.some((role) => admins.includes(role));
  });
});

export const congregationsBaptizedPersonsState = atom((get) => {
  const users = get(congregationUsersState);

  return users.filter(
    (record) =>
      record.profile.global_role === 'vip' &&
      !record.profile.cong_role?.includes('admin') &&
      !record.profile.cong_role?.includes('coordinator') &&
      !record.profile.cong_role?.includes('secretary')
  );
});

export const demoNoticeOpenState = atom(true);

export const congregationCreateStepState = atom(0);

export const backupFileTypeState = atom<BackupFileType>('');

export const backupFileNameState = atom('');

export const backupFileContentsState = atom('');

export const featureFlagsState = atom<Record<string, boolean>>({});
