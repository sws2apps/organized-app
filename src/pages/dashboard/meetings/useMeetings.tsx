import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  congAccountConnectedState,
  isMyAssignmentOpenState,
} from '@states/app';

const useMeetings = () => {
  const setIsMyAssignmentOpen = useSetRecoilState(isMyAssignmentOpenState);

  const isConnected = useRecoilValue(congAccountConnectedState);

  const handleOpenMyAssignments = async () => {
    setIsMyAssignmentOpen(true);
  };

  return { handleOpenMyAssignments, isConnected };
};

export default useMeetings;
