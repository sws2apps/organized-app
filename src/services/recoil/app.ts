// ** FOR SETTING STATE OUTSIDE REACT COMPONENTS OR TO AVOID USE OF USECALLBACK ** //

import { ReactElement } from 'react';
import { promiseSetRecoil } from 'recoil-outside';
import logger from '@services/logger/index';
import {
  apiHostState,
  appMessageState,
  appSeverityState,
  appSnackOpenState,
  congAccountConnectedState,
  congIDState,
  isAccountChooseState,
  isAppLoadState,
  isEmailBlockedState,
  isOnlineState,
  showReloadState,
  isSetupState,
  isUnauthorizedRoleState,
  isUserSignInState,
  offlineOverrideState,
  rootModalOpenState,
  userIDState,
  secretTokenPathState,
  qrCodePathState,
  isEmailLinkAuthenticateState,
  isCongAccountCreateState,
  isUserMfaVerifyState,
  isUserMfaSetupState,
  isAuthProcessingState,
  isMyAssignmentOpenState,
  isWhatsNewOpenState,
  isAboutOpenState,
  userConfirmationTitleState,
  userConfirmationMessageState,
  userConfirmationActionState,
  userConfirmationOpenState,
  backupDbOpenState,
  restoreDbOpenState,
  isCongPersonAddState,
  currentProviderState,
  onboardingTitleState,
  onboardingMessageState,
  onboardingVariantState,
  isSupportOpenState,
  isNewCongregationState,
  isEncryptionCodeOpenState,
  isAppDataSyncingState,
  lastAppDataSyncState,
  isDarkThemeState,
  appMessageHeaderState,
  isMFAEnabledState,
  appMessageIconState,
  isContactOpenState,
  encryptedMasterKeyState,
} from '@states/app';
import { SnackBarSeverityType } from '@definition/app';

export const handleSWOnInstalled = async () => {
  logger.info(
    'service-worker',
    'the service worker was installed and ready for use'
  );
};

export const handleSWOnUpdated = async () => {
  await promiseSetRecoil(showReloadState, true);
  logger.info(
    'service-worker',
    'an updated service worker is ready to be used'
  );
};

export const disconnectCongAccount = async () => {
  await promiseSetRecoil(congAccountConnectedState, false);
};

export const displaySnackNotification = async ({
  header,
  message,
  severity,
  icon,
}: {
  header: string;
  message: string;
  severity?: SnackBarSeverityType;
  icon?: ReactElement;
}) => {
  await promiseSetRecoil(appMessageHeaderState, header);
  await promiseSetRecoil(appMessageState, message);
  await promiseSetRecoil(appSeverityState, severity);
  await promiseSetRecoil(appMessageIconState, icon);
  await promiseSetRecoil(appSnackOpenState, true);
};

export const displayOnboardingFeedback = async ({
  title,
  message,
  variant = 'error',
}) => {
  await promiseSetRecoil(onboardingVariantState, variant);
  await promiseSetRecoil(onboardingTitleState, title);
  await promiseSetRecoil(onboardingMessageState, message);
};

export const setApiHost = async (value) => {
  await promiseSetRecoil(apiHostState, value);
};

export const setIsOnline = async (value) => {
  await promiseSetRecoil(isOnlineState, value);
};

export const setIsAccountChoose = async (value) => {
  await promiseSetRecoil(isAccountChooseState, value);
};

export const setIsUnauthorizedRole = async (value) => {
  await promiseSetRecoil(isUnauthorizedRoleState, value);
};

export const setRootModalOpen = async (value) => {
  await promiseSetRecoil(rootModalOpenState, value);
};

export const setIsSetup = async (value) => {
  await promiseSetRecoil(isSetupState, value);
};

export const setCongAccountConnected = async (value) => {
  await promiseSetRecoil(congAccountConnectedState, value);
};

export const setIsAppLoad = async (value: boolean) => {
  await promiseSetRecoil(isAppLoadState, value);
};

export const setIsUserSignIn = async (value) => {
  await promiseSetRecoil(isUserSignInState, value);
};

export const setCongID = async (value) => {
  await promiseSetRecoil(congIDState, value);
};

export const setUserID = async (value) => {
  await promiseSetRecoil(userIDState, value);
};

export const setOfflineOverride = async (value) => {
  await promiseSetRecoil(offlineOverrideState, value);
};

export const setEmailBlocked = async (value) => {
  await promiseSetRecoil(isEmailBlockedState, value);
};

export const setSecretTokenPathState = async (value) => {
  await promiseSetRecoil(secretTokenPathState, value);
};

export const setQrCodePathState = async (value) => {
  await promiseSetRecoil(qrCodePathState, value);
};

export const setIsEmailLinkAuthenticate = async (value) => {
  await promiseSetRecoil(isEmailLinkAuthenticateState, value);
};

export const setIsCongAccountCreate = async (value) => {
  await promiseSetRecoil(isCongAccountCreateState, value);
};

export const setUserMfaVerify = async (value) => {
  await promiseSetRecoil(isUserMfaVerifyState, value);
};

export const setUserMfaSetup = async (value) => {
  await promiseSetRecoil(isUserMfaSetupState, value);
};

export const setIsAuthProcessing = async (value) => {
  await promiseSetRecoil(isAuthProcessingState, value);
};

export const setMyAssignmentOpen = async (value) => {
  await promiseSetRecoil(isMyAssignmentOpenState, value);
};

export const setWhatsNewOpen = async (value) => {
  await promiseSetRecoil(isWhatsNewOpenState, value);
};

export const setIsAboutOpen = async (value) => {
  await promiseSetRecoil(isAboutOpenState, value);
};
export const setIsContactOpen = async (value) => {
  await promiseSetRecoil(isContactOpenState, value);
};

export const setUserConfirmationOpen = async (value) => {
  await promiseSetRecoil(userConfirmationOpenState, value);
};

export const displayUserConfirmation = async ({ title, message, action }) => {
  await promiseSetRecoil(userConfirmationTitleState, title);
  await promiseSetRecoil(userConfirmationMessageState, message);
  await promiseSetRecoil(userConfirmationActionState, action);
  await setUserConfirmationOpen(true);
};

export const setIsBackupDb = async (value) => {
  await promiseSetRecoil(backupDbOpenState, value);
};

export const setIsRestoreDb = async (value) => {
  await promiseSetRecoil(restoreDbOpenState, value);
};

export const setIsCongPersonAdd = async (value) => {
  await promiseSetRecoil(isCongPersonAddState, value);
};

export const setCurrentProvider = async (value) => {
  await promiseSetRecoil(currentProviderState, value);
};

export const setIsSupportOpen = async (value) => {
  await promiseSetRecoil(isSupportOpenState, value);
};

export const setIsNewCongregation = async (value) => {
  await promiseSetRecoil(isNewCongregationState, value);
};

export const setIsEncryptionCodeOpen = async (value) => {
  await promiseSetRecoil(isEncryptionCodeOpenState, value);
};

export const setIsAppDataSyncing = async (value) => {
  await promiseSetRecoil(isAppDataSyncingState, value);
};

export const setLastAppDataSync = async (value) => {
  await promiseSetRecoil(lastAppDataSyncState, value);
};

export const setIsDarkTheme = async (value) => {
  await promiseSetRecoil(isDarkThemeState, value);
};

export const setAppSnackOpen = async (value) => {
  await promiseSetRecoil(appSnackOpenState, value);
};

export const setAppSnackSeverity = async (value: SnackBarSeverityType) => {
  await promiseSetRecoil(appSeverityState, value);
};

export const setAppSnackMessage = async (value) => {
  await promiseSetRecoil(appMessageState, value);
};

export const setAppSnackMessageHeader = async (value) => {
  await promiseSetRecoil(appMessageHeaderState, value);
};

export const setIsMFAEnabled = async (value) => {
  await promiseSetRecoil(isMFAEnabledState, value);
};

export const setEncryptedMasterKey = async (value: string) => {
  await promiseSetRecoil(encryptedMasterKeyState, value);
};
