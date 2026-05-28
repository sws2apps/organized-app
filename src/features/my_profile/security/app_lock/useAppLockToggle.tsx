import { useCallback, useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import {
  appLockAfterMinutesState,
  appLockBiometricEnabledState,
  appLockHasPinState,
  appLockSettingsState,
} from '@states/settings';
import { userEmailState } from '@states/app';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { displaySnackNotification } from '@services/states/app';
import {
  isBiometricAvailable,
  registerBiometric,
} from '@services/app_lock/webauthn';

const useAppLockToggle = () => {
  const { t } = useAppTranslation();

  const appLock = useAtomValue(appLockSettingsState);
  const hasPin = useAtomValue(appLockHasPinState);
  const lockAfter = useAtomValue(appLockAfterMinutesState);
  const biometricEnabled = useAtomValue(appLockBiometricEnabledState);
  const userEmail = useAtomValue(userEmailState);

  const enabled = hasPin && appLock?.enabled?.value === true;

  const [isCreatePinOpen, setIsCreatePinOpen] = useState(false);
  const [createPinMode, setCreatePinMode] = useState<'create' | 'change'>(
    'create'
  );
  const [biometricSupported, setBiometricSupported] = useState(false);
  const isBiometricToggling = useRef(false);

  useEffect(() => {
    let mounted = true;
    isBiometricAvailable().then((available) => {
      if (mounted) setBiometricSupported(available);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleCloseDialog = useCallback(() => setIsCreatePinOpen(false), []);

  const handleToggle = async () => {
    if (!enabled) {
      setCreatePinMode('create');
      setIsCreatePinOpen(true);
      return;
    }

    const now = new Date().toISOString();
    await dbAppSettingsUpdate({
      'user_settings.app_lock.enabled': { value: false, updatedAt: now },
      'user_settings.app_lock.pin_hash': undefined,
      'user_settings.app_lock.pin_salt': undefined,
      'user_settings.app_lock.pin_iterations': undefined,
      'user_settings.app_lock.biometric_enabled': {
        value: false,
        updatedAt: now,
      },
      'user_settings.app_lock.webauthn_credential_id': undefined,
    });
  };

  const handleChangePIN = () => {
    setCreatePinMode('change');
    setIsCreatePinOpen(true);
  };

  const handleLockAfterChange = async (value: number) => {
    await dbAppSettingsUpdate({
      'user_settings.app_lock.lock_after_minutes': {
        value,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  const handleBiometricToggle = async (checked: boolean) => {
    if (isBiometricToggling.current) return;
    isBiometricToggling.current = true;

    try {
      const now = new Date().toISOString();

      if (!checked) {
        await dbAppSettingsUpdate({
          'user_settings.app_lock.biometric_enabled': {
            value: false,
            updatedAt: now,
          },
          'user_settings.app_lock.webauthn_credential_id': undefined,
        });
        return;
      }

      try {
        const { credentialId } = await registerBiometric(
          userEmail || 'organized-user',
          userEmail || 'user',
          userEmail || 'Organized user'
        );

        await dbAppSettingsUpdate({
          'user_settings.app_lock.biometric_enabled': {
            value: true,
            updatedAt: now,
          },
          'user_settings.app_lock.webauthn_credential_id': credentialId,
        });

        displaySnackNotification({
          header: t('tr_biometricEnabled'),
          message: t('tr_biometricEnabledDesc'),
          severity: 'success',
        });
      } catch {
        displaySnackNotification({
          header: t('tr_biometricRegisterFailed'),
          message: t('tr_biometricRegisterFailedDesc'),
          severity: 'error',
        });
      }
    } finally {
      isBiometricToggling.current = false;
    }
  };

  return {
    enabled,
    lockAfter,
    biometricEnabled,
    biometricSupported,
    isCreatePinOpen,
    createPinMode,
    handleToggle,
    handleCloseDialog,
    handleChangePIN,
    handleLockAfterChange,
    handleBiometricToggle,
  };
};

export default useAppLockToggle;
