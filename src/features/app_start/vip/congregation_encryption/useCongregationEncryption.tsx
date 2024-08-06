import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import {
  congMasterKeyState,
  congAccessCodeState,
  congRoleState,
} from '@states/settings';
import { VIP_ROLES } from '@constants/index';
import { loadApp, runUpdater } from '@services/app';
import {
  setCongAccountConnected,
  setIsAppLoad,
  setIsSetup,
  setOfflineOverride,
} from '@services/recoil/app';

const useCongregationEncryption = () => {
  const congMasterKey = useRecoilValue(congMasterKeyState);
  const congAccessCode = useRecoilValue(congAccessCodeState);
  const congRole = useRecoilValue(congRoleState);

  const roleNeedMasterKey = congRole.some((role) => VIP_ROLES.includes(role));

  const setupMasterKey = roleNeedMasterKey && congMasterKey.length === 0;
  const setupAccessCode = congAccessCode.length === 0;

  useEffect(() => {
    const completeEncryptionStage = async () => {
      await loadApp();

      await setIsSetup(false);

      await runUpdater();
      setTimeout(async () => {
        await setOfflineOverride(false);
        await setCongAccountConnected(true);
        await setIsAppLoad(false);
      }, 2000);
    };

    if (!setupMasterKey && !setupAccessCode) completeEncryptionStage();
  }, [setupAccessCode, setupMasterKey]);

  return { setupMasterKey, setupAccessCode };
};

export default useCongregationEncryption;
