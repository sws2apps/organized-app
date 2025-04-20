import { useAtomValue } from 'jotai';
import { joinRequestsState } from '@states/congregation';

const useJoinRequests = () => {
  const requests = useAtomValue(joinRequestsState);

  return { requests };
};

export default useJoinRequests;
