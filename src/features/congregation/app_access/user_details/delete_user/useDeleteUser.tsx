import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { DeleteUserType } from './index.types';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { apiCongregationUserDelete } from '@services/api/congregation';
import { CongregationUserType } from '@definition/api';
import { buildPersonFullname } from '@utils/common';
import { fullnameOptionState } from '@states/settings';
import { congregationUsersState } from '@states/app';

const useDeleteUser = (
  user: CongregationUserType,
  onClose: DeleteUserType['onClose']
) => {
  const { t } = useAppTranslation();

  const navigate = useNavigate();

  const setUsers = useSetRecoilState(congregationUsersState);

  const fullnameOption = useRecoilValue(fullnameOptionState);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeleteUser = async () => {
    try {
      setIsProcessing(true);

      const users = await apiCongregationUserDelete(user.id);
      setUsers(users);

      const personName = buildPersonFullname(
        user.profile.lastname.value,
        user.profile.firstname.value,
        fullnameOption
      );

      onClose?.();
      navigate('/manage-access');

      await displaySnackNotification({
        header: t('tr_userDeletedTitle', { UserName: personName }),
        message: t('tr_userDeletedDesc', { UserName: personName }),
        severity: 'success',
      });
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

  return { isProcessing, handleDeleteUser };
};

export default useDeleteUser;
