import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { DeleteCodeType } from './index.types';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { apiAdminDeletePocketCode } from '@services/api/congregation';
import { CongregationUserType } from '@definition/api';
import { congregationUsersState } from '@states/app';

const useDeleteCode = (
  user: CongregationUserType,
  onClose: DeleteCodeType['onClose']
) => {
  const { t } = useAppTranslation();

  const setUsers = useSetRecoilState(congregationUsersState);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeleteCode = async () => {
    try {
      setIsProcessing(true);

      const users = await apiAdminDeletePocketCode(user.id);
      setUsers(users);

      await displaySnackNotification({
        header: t('tr_savedDesc'),
        message: t('tr_settingsAutoSaved'),
        severity: 'success',
      });

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
