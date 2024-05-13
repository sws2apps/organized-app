import { useRecoilValue } from 'recoil';
import { congMasterKeyState, congRoleState } from '@states/settings';
import { VIP_ROLES } from '@constants/index';

const useCongregationEncryption = () => {
  const congMasterKey = useRecoilValue(congMasterKeyState);
  const congRole = useRecoilValue(congRoleState);

  const roleNeedMasterKey = congRole.some((role) => VIP_ROLES.includes(role));

  const setupMasterKey = roleNeedMasterKey && congMasterKey.length === 0;

  return { setupMasterKey };
};

export default useCongregationEncryption;
