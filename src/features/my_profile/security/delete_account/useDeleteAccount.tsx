import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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

  const { data, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: apiCongregationUsersGet,
    enabled: isAdmin,
  });

  const users = useMemo(() => {
    if (!data) return [];
    if (!Array.isArray(data.users)) return [];

    return data.users;
  }, [data]);

  const adminCount = useMemo(() => {
    return users.filter((user) => {
      if (!user.profile.cong_role) return false;

      return user.profile.cong_role.some(
        (role) =>
          role === 'admin' || role === 'coordinator' || role === 'secretary'
      );
    }).length;
  }, [users]);

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
        header: getMessageByCode('error_app_generic-title'),
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
    if (!isAdmin) {
      setDesc(t('tr_deleteAccountDesc'));
      setIsLoading(false);
    }
  }, [isAdmin, t]);

  useEffect(() => {
    const loadDetails = async () => {
      setIsLoading(true);

      try {
        if (users.length === 1) {
          setDesc(t('tr_deleteAccountWithCongregationDesc'));
          setIsDeleteCong(true);
          setIsLoading(false);
          return;
        }

        if (adminCount > 1) {
          setDesc(t('tr_deleteAccountDesc'));
          setIsLoading(false);
          return;
        }

        if (adminCount === 1) {
          setDesc(t('tr_deleteAccountAssignAdminFirst'));
          setIsManageAccess(true);
          setIsLoading(false);
        }
      } catch (error) {
        closeDialog();

        displaySnackNotification({
          header: getMessageByCode('error_app_generic-title'),
          message: getMessageByCode(error.message),
          severity: 'error',
        });
      }
    };

    if (isAdmin && !isLoadingUsers) loadDetails();
  }, [isAdmin, t, closeDialog, users, adminCount, isLoadingUsers]);

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
