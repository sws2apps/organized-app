import { useRecoilValue } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { apiGetUserSessions } from '@services/api/user';
import { userIDState } from '@states/app';
import { getMessageByCode } from '@services/i18n/translation';

const useSessions = () => {
  const userID = useRecoilValue(userIDState);

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

  return { sessions, isLoading, errorMsg };
};

export default useSessions;
