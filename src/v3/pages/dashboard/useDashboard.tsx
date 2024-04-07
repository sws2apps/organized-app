import { useRecoilValue } from 'recoil';
import { handleUpdateSetting } from '@services/dexie/settings';
import { congNewState, firstnameState } from '@states/settings';
import { setIsMyAssignmentOpen } from '@services/recoil/app';

const useDashboard = () => {
  const firstName = useRecoilValue(firstnameState);
  const isCongNew = useRecoilValue(congNewState);

  const handleCloseNewCongNotice = async () => {
    await handleUpdateSetting({ cong_new: false });
  };

  const handleOpenMyAssignments = async () => {
    await setIsMyAssignmentOpen(true);
  };

  return { firstName, isCongNew, handleCloseNewCongNotice, handleOpenMyAssignments };
};

export default useDashboard;
