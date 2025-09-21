// ** FOR SETTING STATE OUTSIDE REACT COMPONENTS OR TO AVOID USE OF USECALLBACK ** //

import { SnackBarSeverityType } from '@definition/app';
import logger from '@services/logger/index';
import { store } from '@states/index';
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
  appMessageHeaderState,
  isMFAEnabledState,
  isContactOpenState,
  encryptedMasterKeyState,
  appMessageIconState,
} from '@states/app';
import { ReactElement } from 'react';

export const handleSWOnInstalled = () => {
  logger.info(
    'service-worker',
    'the service worker was installed and ready for use'
  );
};

export const handleSWOnUpdated = () => {
  store.set(showReloadState, true);

  logger.info(
    'service-worker',
    'an updated service worker is ready to be used'
  );
};

export const disconnectCongAccount = () => {
  store.set(congAccountConnectedState, false);
};

export const displaySnackNotification = ({
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
  store.set(appMessageHeaderState, header);
  store.set(appMessageState, message);
  store.set(appMessageIconState, icon);
  store.set(appSeverityState, severity);
  store.set(appSnackOpenState, true);
};

export const displayOnboardingFeedback = ({
  title,
  message,
  variant = 'error',
}: {
  title: string;
  message: string;
  variant?: 'error' | 'success' | 'message-with-button';
}) => {
  store.set(onboardingVariantState, variant);
  store.set(onboardingTitleState, title);
  store.set(onboardingMessageState, message);
};

export const setApiHost = (value: string) => {
  store.set(apiHostState, value);
};

export const setIsOnline = (value: boolean) => {
  store.set(isOnlineState, value);
};

export const setIsAccountChoose = (value: boolean) => {
  store.set(isAccountChooseState, value);
};

export const setIsUnauthorizedRole = (value: boolean) => {
  store.set(isUnauthorizedRoleState, value);
};

export const setRootModalOpen = (value: boolean) => {
  store.set(rootModalOpenState, value);
};

export const setIsSetup = (value: boolean) => {
  store.set(isSetupState, value);
};

export const setCongAccountConnected = (value: boolean) => {
  store.set(congAccountConnectedState, value);
};

export const setIsAppLoad = (value: boolean) => {
  store.set(isAppLoadState, value);
};

export const setIsUserSignIn = (value: boolean) => {
  store.set(isUserSignInState, value);
};

export const setCongID = (value: string) => {
  store.set(congIDState, value);
};

export const setUserID = (value: string) => {
  store.set(userIDState, value);
};

export const setOfflineOverride = (value: boolean) => {
  store.set(offlineOverrideState, value);
};

export const setEmailBlocked = (value: boolean) => {
  store.set(isEmailBlockedState, value);
};

export const setSecretTokenPathState = (value: string) => {
  store.set(secretTokenPathState, value);
};

export const setQrCodePathState = (value: string) => {
  store.set(qrCodePathState, value);
};

export const setIsEmailLinkAuthenticate = (value: boolean) => {
  store.set(isEmailLinkAuthenticateState, value);
};

export const setIsCongAccountCreate = (value: boolean) => {
  store.set(isCongAccountCreateState, value);
};

export const setUserMfaVerify = (value: boolean) => {
  store.set(isUserMfaVerifyState, value);
};

export const setUserMfaSetup = (value: boolean) => {
  store.set(isUserMfaSetupState, value);
};

export const setIsAuthProcessing = (value: boolean) => {
  store.set(isAuthProcessingState, value);
};

export const setMyAssignmentOpen = (value: boolean) => {
  store.set(isMyAssignmentOpenState, value);
};

export const setWhatsNewOpen = (value: boolean) => {
  store.set(isWhatsNewOpenState, value);
};

export const setIsAboutOpen = (value: boolean) => {
  store.set(isAboutOpenState, value);
};
export const setIsContactOpen = (value: boolean) => {
  store.set(isContactOpenState, value);
};

export const setUserConfirmationOpen = (value: boolean) => {
  store.set(userConfirmationOpenState, value);
};

export const displayUserConfirmation = ({
  title,
  message,
}: {
  title: string;
  message: string;
}) => {
  store.set(userConfirmationTitleState, title);
  store.set(userConfirmationMessageState, message);

  setUserConfirmationOpen(true);
};

export const setIsBackupDb = (value: boolean) => {
  store.set(backupDbOpenState, value);
};

export const setIsRestoreDb = (value: boolean) => {
  store.set(restoreDbOpenState, value);
};

export const setIsCongPersonAdd = (value: boolean) => {
  store.set(isCongPersonAddState, value);
};

export const setCurrentProvider = (value: string) => {
  store.set(currentProviderState, value);
};

export const setIsSupportOpen = (value: boolean) => {
  store.set(isSupportOpenState, value);
};

export const setIsNewCongregation = (value: boolean) => {
  store.set(isNewCongregationState, value);
};

export const setIsEncryptionCodeOpen = (value: boolean) => {
  store.set(isEncryptionCodeOpenState, value);
};

export const setIsAppDataSyncing = (value: boolean) => {
  store.set(isAppDataSyncingState, value);
};

export const setLastAppDataSync = (value: number | string) => {
  store.set(lastAppDataSyncState, value);
};

export const setAppSnackOpen = (value: boolean) => {
  store.set(appSnackOpenState, value);
};

export const setAppSnackSeverity = (value: SnackBarSeverityType) => {
  store.set(appSeverityState, value);
};

export const setAppSnackMessage = (value: string) => {
  store.set(appMessageState, value);
};

export const setAppSnackMessageHeader = (value: string) => {
  store.set(appMessageHeaderState, value);
};

export const setIsMFAEnabled = (value: boolean) => {
  store.set(isMFAEnabledState, value);
};

export const setEncryptedMasterKey = (value: string) => {
  store.set(encryptedMasterKeyState, value);
};
