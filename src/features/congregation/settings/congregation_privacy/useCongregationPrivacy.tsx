import { useAtomValue } from 'jotai';
import { congAccountConnectedState } from '@states/app';

const useCongregationPrivacy = () => {
  const isConnected = useAtomValue(congAccountConnectedState);

  return { isConnected };
};

export default useCongregationPrivacy;
