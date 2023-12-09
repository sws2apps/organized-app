import { firstnameState } from '@states/settings';
import { useRecoilValue } from 'recoil';

const useDashboard = () => {
  const firstName = useRecoilValue(firstnameState);

  return { firstName };
};

export default useDashboard;
