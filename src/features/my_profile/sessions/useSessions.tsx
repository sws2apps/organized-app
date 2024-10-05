import { useRecoilValue } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { apiGetUserSessions, apiRevokeVIPSession } from '@services/api/user';
import { congAccountConnectedState, userIDState } from '@states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { accountTypeState } from '@states/settings';
import { SessionResponseType } from '@definition/api';
import {
  apiGetPocketSessions,
  apiRevokePocketSession,
} from '@services/api/pocket';

const useSessions = () => {
  const userID = useRecoilValue(userIDState);
  const accountType = useRecoilValue(accountTypeState);
  const isConnected = useRecoilValue(congAccountConnectedState);

  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ['sessions'],
    queryFn: accountType === 'vip' ? apiGetUserSessions : apiGetPocketSessions,
    enabled:
      accountType === 'vip' ? isConnected && userID.length > 0 : isConnected,
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
      let status: number;
      let message: string;

      if (accountType === 'vip') {
        const result = await apiRevokeVIPSession(session.identifier);
        status = result.status;
        message = result?.data?.message || '';
      }

      if (accountType === 'pocket') {
        const result = await apiRevokePocketSession(session.identifier);
        status = result.status;
        message = result?.data?.message || '';
      }

      if (status && status !== 200) {
        throw new Error(message);
      }

      await refetch();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return { sessions, isLoading, errorMsg, handleTerminate };
};

export default useSessions;
