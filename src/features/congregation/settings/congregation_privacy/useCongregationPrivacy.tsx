import { useRecoilValue } from 'recoil';
import { congAccountConnectedState } from '@states/app';

const useCongregationPrivacy = () => {
  const isConnected = useRecoilValue(congAccountConnectedState);

  return { isConnected };
};

export default useCongregationPrivacy;
