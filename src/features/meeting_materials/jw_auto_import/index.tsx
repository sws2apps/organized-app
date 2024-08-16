import { useCallback, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { isDemo } from '@constants/index';
import { isAppLoadState } from '@states/app';
import {
  adminRoleState,
  coordinatorRoleState,
  lmmoRoleState,
  publicTalkCoordinatorRoleState,
  sourcesJWAutoImportState,
} from '@states/settings';
import { apiFetchSources } from '@services/api/sources';
import { sourcesImportJW } from '@services/app/sources';

const JWAutoImport = () => {
  const isAppLoad = useRecoilValue(isAppLoadState);
  const isAdmin = useRecoilValue(adminRoleState);
  const isLMMO = useRecoilValue(lmmoRoleState);
  const isCoordinator = useRecoilValue(coordinatorRoleState);
  const isPublicTalkCoordinator = useRecoilValue(
    publicTalkCoordinatorRoleState
  );
  const isAutoImportEnabled = useRecoilValue(sourcesJWAutoImportState);

  const approvedRole =
    isAdmin || isLMMO || isCoordinator || isPublicTalkCoordinator;

  const handleJWAutoImport = useCallback(async () => {
    const { data, status } = await apiFetchSources();
    if (status === 200 && data && data.length) {
      await sourcesImportJW(data);
    }
  }, []);

  useEffect(() => {
    if (!isAppLoad) {
      if (isDemo) {
        handleJWAutoImport();
      }

      if (!isDemo && isAutoImportEnabled && approvedRole) {
        const now = new Date().toISOString();
        const nextSync = localStorage.getItem('organized_jw-import-next-sync');

        if (!nextSync || (nextSync && nextSync <= now)) {
          handleJWAutoImport();
        }
      }
    }
  }, [handleJWAutoImport, isAppLoad, isAutoImportEnabled, approvedRole]);

  return <></>;
};

export default JWAutoImport;
