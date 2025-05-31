import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
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
} from '@services/states/app';

const useCongregationEncryption = () => {
  const congMasterKey = useAtomValue(congMasterKeyState);
  const congAccessCode = useAtomValue(congAccessCodeState);
  const congRole = useAtomValue(congRoleState);

  const roleNeedMasterKey = congRole.some((role) => VIP_ROLES.includes(role));

  const setupMasterKey = roleNeedMasterKey && congMasterKey.length === 0;
  const setupAccessCode = congAccessCode.length === 0;

  useEffect(() => {
    const completeEncryptionStage = async () => {
      await runUpdater();

      loadApp();

      setIsSetup(false);

      setTimeout(() => {
        setOfflineOverride(false);
        setCongAccountConnected(true);
        setIsAppLoad(false);
      }, 2000);
    };

    if (!setupMasterKey && !setupAccessCode) completeEncryptionStage();
  }, [setupAccessCode, setupMasterKey]);

  return { setupMasterKey, setupAccessCode };
};

export default useCongregationEncryption;
