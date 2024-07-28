import { useRecoilValue, useSetRecoilState } from 'recoil';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { congNewState, firstnameState } from '@states/settings';
import { isMyAssignmentOpenState } from '@states/app';

const useDashboard = () => {
  const setIsMyAssignmentOpen = useSetRecoilState(isMyAssignmentOpenState);

  const firstName = useRecoilValue(firstnameState);
  const isCongNew = useRecoilValue(congNewState);

  const handleCloseNewCongNotice = async () => {
    await dbAppSettingsUpdate({ 'cong_settings.cong_new': false });
  };

  const handleOpenMyAssignments = async () => {
    setIsMyAssignmentOpen(true);
  };

  return {
    firstName,
    isCongNew,
    handleCloseNewCongNotice,
    handleOpenMyAssignments,
  };
};

export default useDashboard;
