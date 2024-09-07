import { SessionResponseType } from '@definition/api';
import useUserDetails from '../useUserDetails';

const useUserSessions = () => {
  const { user, handleTerminateSession } = useUserDetails();

  const handleTerminate = async (session: SessionResponseType) => {
    await handleTerminateSession(session.identifier);
  };

  return { handleTerminate, user };
};

export default useUserSessions;
