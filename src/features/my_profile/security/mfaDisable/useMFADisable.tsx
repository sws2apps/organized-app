import { useState } from 'react';
import { apiDisableUser2FA } from '@services/api/user';
import {
  displaySnackNotification,
  setIsMFAEnabled,
} from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';

const useMFADisable = (closeDialog: VoidFunction) => {
  const { t } = useAppTranslation();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleDisable2FA = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const result = await apiDisableUser2FA();

      if (result.status === 200) {
        await setIsMFAEnabled(false);
        setIsProcessing(false);
        closeDialog();

        await displaySnackNotification({
          header: t('tr_2FADisabled'),
          message: t('tr_2FADisabledDesc'),
          severity: 'success',
        });

        return;
      }

      setIsProcessing(false);
      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(result.data.message),
        severity: 'error',
      });
    } catch (error) {
      setIsProcessing(false);

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return { isProcessing, handleDisable2FA };
};

export default useMFADisable;
