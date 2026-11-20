import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation, useFirebaseAuth } from '@hooks/index';
import {
  appLockBiometricEnabledState,
  appLockEnabledState,
  appLockSettingsState,
} from '@states/app_lock';
import { appLockUpdate } from '@services/app_lock/storage';
import { displaySnackNotification } from '@services/states/app';
import {
  isBiometricAvailable,
  registerBiometric,
} from '@services/app_lock/webauthn';
import { CreatePinMode } from '@features/app_lock/create_pin/useCreatePin';

const useAppLockToggle = () => {
  const { t } = useAppTranslation();
  const { user } = useFirebaseAuth();

  const enabled = useAtomValue(appLockEnabledState);
  const biometricEnabled = useAtomValue(appLockBiometricEnabledState);
  const { lock_after_minutes } = useAtomValue(appLockSettingsState);

  const [createPinMode, setCreatePinMode] = useState<CreatePinMode | null>(
    null
  );
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [isBiometricProcessing, setIsBiometricProcessing] = useState(false);

  useEffect(() => {
    let active = true;

    void isBiometricAvailable().then((available) => {
      if (active) setBiometricSupported(available);
    });

    return () => {
      active = false;
    };
  }, []);

  const handleToggle = () => setCreatePinMode(enabled ? 'disable' : 'create');

  const handleChangePin = () => setCreatePinMode('change');

  const handleCloseDialog = () => setCreatePinMode(null);

  const handleLockAfterChange = (minutes: number) => {
    appLockUpdate({ lock_after_minutes: minutes });
  };

  const handleBiometricToggle = async (checked: boolean) => {
    if (!checked) {
      appLockUpdate({
        biometric_enabled: false,
        webauthn_credential_id: undefined,
      });
      return;
    }

    if (isBiometricProcessing) return;

    setIsBiometricProcessing(true);

    try {
      const { credentialId } = await registerBiometric(
        user?.email ?? 'Organized'
      );

      appLockUpdate({
        biometric_enabled: true,
        webauthn_credential_id: credentialId,
      });

      displaySnackNotification({
        header: t('tr_appLockBiometricOn'),
        message: t('tr_appLockBiometricOnDesc'),
        severity: 'success',
      });
    } catch {
      displaySnackNotification({
        header: t('tr_appLockBiometricFailed'),
        message: t('tr_appLockBiometricFailedDesc'),
        severity: 'error',
      });
    } finally {
      setIsBiometricProcessing(false);
    }
  };

  return {
    enabled,
    lockAfterMinutes: lock_after_minutes,
    biometricEnabled,
    biometricSupported,
    isBiometricProcessing,
    createPinMode,
    handleToggle,
    handleChangePin,
    handleCloseDialog,
    handleLockAfterChange,
    handleBiometricToggle,
  };
};

export default useAppLockToggle;
