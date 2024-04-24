import { useRecoilValue } from 'recoil';
import { congNameState, congNumberState } from '@states/settings';

const useHeader = () => {
  const congName = useRecoilValue(congNameState);
  const congNumber = useRecoilValue(congNumberState);

  return { congName, congNumber };
};

export default useHeader;
