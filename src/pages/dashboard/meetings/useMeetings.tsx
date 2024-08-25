import { useSetRecoilState } from 'recoil';
import { isMyAssignmentOpenState } from '@states/app';

const useMeetings = () => {
  const setIsMyAssignmentOpen = useSetRecoilState(isMyAssignmentOpenState);

  const handleOpenMyAssignments = async () => {
    setIsMyAssignmentOpen(true);
  };

  return { handleOpenMyAssignments };
};

export default useMeetings;
