import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';
import {
  apiAdminRevokeUserSession,
  apiCongregationUserUpdate,
} from '@services/api/congregation';
import { APICongregationUserType, CongregationUserType } from '@definition/api';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';
import { currentCongregationUserState } from '@states/congregation';

const useUserDetails = () => {
  const { id } = useParams();

  const { t } = useAppTranslation();

  const queryClient = useQueryClient();

  const [user, setUser] = useRecoilState(currentCongregationUserState);

  const refetchUser = () => {
    const congregation_users: APICongregationUserType =
      queryClient.getQueryData(['congregation_users']);

    const user = congregation_users.users.find((record) => record.id === id);

    if (user) {
      setUser(structuredClone(user));
    }
  };

  const handleSaveDetails = async (
    user: CongregationUserType,
    code?: string
  ) => {
    try {
      const { status, message } = await apiCongregationUserUpdate({
        user_id: user.id,
        cong_person_uid: user.user_local_uid,
        cong_person_delegates: user.user_delegates,
        cong_role: user.cong_role,
        user_secret_code: code,
      });

      if (status !== 200) {
        throw new Error(message);
      }

      await queryClient.invalidateQueries({ queryKey: ['congregation_users'] });
      await queryClient.refetchQueries({ queryKey: ['congregation_users'] });

      await displaySnackNotification({
        header: t('tr_savedDesc'),
        message: t('tr_settingsAutoSaved'),
        severity: 'success',
      });

      refetchUser();
    } catch (error) {
      throw new Error(error?.message);
    }
  };

  const handleTerminateSession = async (identifier: string) => {
    try {
      if (user.global_role === 'vip') {
        const result = await apiAdminRevokeUserSession(user.id, identifier);

        if (result.status !== 200) {
          throw new Error(result.data.message);
        }

        await queryClient.invalidateQueries({
          queryKey: ['congregation_users'],
        });
        await queryClient.refetchQueries({ queryKey: ['congregation_users'] });
      }

      refetchUser();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return { handleSaveDetails, user, handleTerminateSession, refetchUser };
};

export default useUserDetails;
