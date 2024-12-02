import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppTranslation } from '@hooks/index';
import { DeleteCodeType } from './index.types';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { apiAdminDeletePocketCode } from '@services/api/congregation';
import { CongregationUserType } from '@definition/api';
import useUserDetails from '../../useUserDetails';

const useDeleteCode = (
  user: CongregationUserType,
  onClose: DeleteCodeType['onClose']
) => {
  const { t } = useAppTranslation();

  const queryClient = useQueryClient();

  const { refetchUser } = useUserDetails();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeleteCode = async () => {
    try {
      setIsProcessing(true);

      const { status, message } = await apiAdminDeletePocketCode(user.id);

      if (status !== 200) {
        throw new Error(message);
      }

      await displaySnackNotification({
        header: t('tr_savedDesc'),
        message: t('tr_settingsAutoSaved'),
        severity: 'success',
      });

      await queryClient.refetchQueries({ queryKey: ['congregation_users'] });
      refetchUser();

      setIsProcessing(false);
      onClose?.();
    } catch (error) {
      console.error(error);

      setIsProcessing(false);
      onClose?.();

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return { isProcessing, handleDeleteCode };
};

export default useDeleteCode;
