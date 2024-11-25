import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUserDelete } from '@services/api/user';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import {
  apiCongregationDelete,
  apiCongregationUsersGet,
} from '@services/api/congregation';
import { userSignOut } from '@services/firebase/auth';
import { handleDeleteDatabase } from '@services/app';
import { apiPocketDelete } from '@services/api/pocket';

const useDeleteAccount = (closeDialog: VoidFunction) => {
  const { t } = useAppTranslation();

  const navigate = useNavigate();

  const { isAdmin, accountType } = useCurrentUser();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [desc, setDesc] = useState('');
  const [masterKey, setMasterKey] = useState('');
  const [isDeleteCong, setIsDeleteCong] = useState(false);
  const [isManageAccess, setIsManageAccess] = useState(false);

  const handleDelete = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      if (!isDeleteCong) {
        if (accountType === 'vip') await apiUserDelete();
        if (accountType === 'pocket') await apiPocketDelete();
      }

      if (isDeleteCong) {
        await apiCongregationDelete(masterKey);
      }

      await userSignOut();
      await handleDeleteDatabase();

      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleOpenManageAccess = () => {
    closeDialog();
    navigate('/manage-access');
  };

  useEffect(() => {
    const loadDetails = async () => {
      setIsDeleteCong(false);
      setIsManageAccess(false);

      try {
        if (!isAdmin) {
          setDesc(t('tr_deleteAccountDesc'));
          setIsLoading(false);
          return;
        }

        const { users } = await apiCongregationUsersGet();

        if (users.length === 1) {
          setDesc(t('tr_deleteAccountWithCongregationDesc'));
          setIsDeleteCong(true);
          setIsLoading(false);
          return;
        }

        const admins = users.filter((user) =>
          user.profile.cong_role.includes('admin')
        ).length;

        if (admins > 1) {
          setDesc(t('tr_deleteAccountDesc'));
          setIsLoading(false);
          return;
        }

        setDesc(t('tr_deleteAccountAssignAdminFirst'));
        setIsManageAccess(true);
        setIsLoading(false);
      } catch (error) {
        closeDialog();

        displaySnackNotification({
          header: t('tr_errorTitle'),
          message: getMessageByCode(error.message),
          severity: 'error',
        });
      }
    };

    loadDetails();
  }, [isAdmin, t, closeDialog]);

  return {
    isProcessing,
    handleDelete,
    isLoading,
    desc,
    isDeleteCong,
    isManageAccess,
    masterKey,
    setMasterKey,
    handleOpenManageAccess,
  };
};

export default useDeleteAccount;
