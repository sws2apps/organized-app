import { SessionResponseType } from '@definition/api';
import useUserDetails from '../useUserDetails';

const useUserSessions = () => {
  const { currentUser, handleTerminateSession } = useUserDetails();

  const handleTerminate = async (session: SessionResponseType) => {
    await handleTerminateSession(session.identifier);
  };

  return { handleTerminate, currentUser };
};

export default useUserSessions;
