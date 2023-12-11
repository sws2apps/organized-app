import { useRecoilValue } from 'recoil';
import { handleUpdateSetting } from '@services/dexie/settings';
import { congNewState, firstnameState } from '@states/settings';

const useDashboard = () => {
  const firstName = useRecoilValue(firstnameState);
  const isCongNew = useRecoilValue(congNewState);

  const handleCloseNewCongNotice = async () => {
    await handleUpdateSetting({ cong_new: false });
  };

  return { firstName, isCongNew, handleCloseNewCongNotice };
};

export default useDashboard;
