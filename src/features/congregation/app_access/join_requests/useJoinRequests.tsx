import { useRecoilValue } from 'recoil';
import { joinRequestsState } from '@states/congregation';

const useJoinRequests = () => {
  const requests = useRecoilValue(joinRequestsState);

  return { requests };
};

export default useJoinRequests;
