import { setIsMyAssignmentOpen } from '@services/recoil/app';

const useMeetings = () => {
  const handleOpenMyAssignments = async () => {
    await setIsMyAssignmentOpen(true);
  };

  return { handleOpenMyAssignments };
};

export default useMeetings;
