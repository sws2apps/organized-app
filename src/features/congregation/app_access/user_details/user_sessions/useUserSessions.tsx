import { useSetRecoilState } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';
import { CongregationUserType, SessionResponseType } from '@definition/api';
import { apiAdminRevokeUserSession } from '@services/api/congregation';
import { refreshScreenState } from '@states/app';

const useUserSessions = (user: CongregationUserType) => {
  const queryClient = useQueryClient();

  const forceRefresh = useSetRecoilState(refreshScreenState);

  const handleTerminate = async (session: SessionResponseType) => {
    try {
      if (user.global_role === 'vip') {
        const result = await apiAdminRevokeUserSession(
          user.id,
          session.identifier
        );

        if (result.status !== 200) {
          throw new Error(result.data.message);
        }

        await queryClient.refetchQueries({ queryKey: ['congregation_users'] });

        forceRefresh((prev) => !prev);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return { handleTerminate };
};

export default useUserSessions;
