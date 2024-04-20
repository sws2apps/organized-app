import { useRecoilValue } from 'recoil';
import { setIsMyAssignmentOpen } from '@services/recoil/app';
import { congAccountConnectedState } from '@states/app';

const useMeetings = () => {
  const isConnected = useRecoilValue(congAccountConnectedState);

  const handleOpenMyAssignments = async () => {
    await setIsMyAssignmentOpen(true);
  };

  return { handleOpenMyAssignments, isConnected };
};

export default useMeetings;
