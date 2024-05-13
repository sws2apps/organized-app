import { useRecoilValue } from 'recoil';
import { congMasterKeyState } from '@states/settings';

const useCongregationEncryption = () => {
  const congMasterKey = useRecoilValue(congMasterKeyState);

  const setupMasterKey = congMasterKey.length === 0;

  return { setupMasterKey };
};

export default useCongregationEncryption;
