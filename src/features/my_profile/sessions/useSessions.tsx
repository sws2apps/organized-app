import { useRecoilValue } from 'recoil';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGetUserSessions, apiRevokeVIPSession } from '@services/api/user';
import { userIDState } from '@states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { accountTypeState } from '@states/settings';
import { SessionResponseType } from '@definition/api';

const useSessions = () => {
  const queryClient = useQueryClient();

  const userID = useRecoilValue(userIDState);
  const accountType = useRecoilValue(accountTypeState);

  const { isLoading, data, error } = useQuery({
    queryKey: ['sessions'],
    queryFn: apiGetUserSessions,
    enabled: userID.length > 0,
    refetchOnWindowFocus: 'always',
    refetchInterval: 15000,
  });

  const errorMsg =
    getMessageByCode(error?.message) ||
    getMessageByCode(data?.result?.message) ||
    '';

  const sessions = data?.result?.sessions || [];

  const handleTerminate = async (session: SessionResponseType) => {
    try {
      if (accountType === 'vip') {
        const result = await apiRevokeVIPSession(session.identifier);

        if (result.status !== 200) {
          throw new Error(result.data.message);
        }

        await queryClient.refetchQueries({ queryKey: ['sessions'] });
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return { sessions, isLoading, errorMsg, handleTerminate };
};

export default useSessions;
