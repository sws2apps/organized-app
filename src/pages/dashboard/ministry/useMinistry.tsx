import { useRecoilValue } from 'recoil';
import { pioneerRoleState } from '@states/settings';

const useMinistry = () => {
  const isPioneer = useRecoilValue(pioneerRoleState);

  return { isPioneer };
};

export default useMinistry;
