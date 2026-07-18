import { congAddressState, congNameState } from '@states/settings';
import { useAtomValue } from 'jotai';

const useCongregationInfo = () => {
  const congName = useAtomValue(congNameState);
  const congAddress = useAtomValue(congAddressState);

  return {
    congName,
    congAddress,
  };
};

export default useCongregationInfo;
