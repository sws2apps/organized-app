import { useSetAtom } from 'jotai';
import { isMyAssignmentOpenState } from '@states/app';

const useMeetings = () => {
  const setIsMyAssignmentOpen = useSetAtom(isMyAssignmentOpenState);

  const handleOpenMyAssignments = async () => {
    setIsMyAssignmentOpen(true);
  };

  return { handleOpenMyAssignments };
};

export default useMeetings;
