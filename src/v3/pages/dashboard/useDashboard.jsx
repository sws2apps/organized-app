import { firstNameState } from '@states/settings';
import { useRecoilValue } from 'recoil';

const useDashboard = () => {
  const firstName = useRecoilValue(firstNameState);

  return { firstName };
};

export default useDashboard;
