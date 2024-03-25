import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { apiGetUserSessions } from '@services/api/user';
import { SessionResponseType } from '@definition/api';
import { userIDState } from '@states/app';

const useSessions = () => {
  const userID = useRecoilValue(userIDState);

  const { isLoading, data } = useQuery({
    queryKey: ['sessions'],
    queryFn: apiGetUserSessions,
    enabled: userID.length > 0,
  });

  const [sessions, setSessions] = useState<[SessionResponseType] | []>([]);

  useEffect(() => {
    if (!isLoading && data?.status === 200) {
      setSessions(data.data);
    }
  }, [isLoading, data]);

  return { sessions };
};

export default useSessions;
