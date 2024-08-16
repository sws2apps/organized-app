import { useCallback, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { isDemo } from '@constants/index';
import { isAppLoadState } from '@states/app';
import {
  adminRoleState,
  lmmoRoleState,
  sourcesJWAutoImportState,
} from '@states/settings';
import { apiFetchSources } from '@services/api/sources';
import { sourcesImportJW } from '@services/app/sources';

const JWAutoImport = () => {
  const isAppLoad = useRecoilValue(isAppLoadState);
  const isAdmin = useRecoilValue(adminRoleState);
  const isLMMO = useRecoilValue(lmmoRoleState);
  const isAutoImportEnabled = useRecoilValue(sourcesJWAutoImportState);

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

      if (!isDemo && isAutoImportEnabled && (isAdmin || isLMMO)) {
        const now = new Date().toISOString();
        const nextSync = localStorage.getItem('organized_jw-import-next-sync');

        if (!nextSync || (nextSync && nextSync <= now)) {
          handleJWAutoImport();
        }
      }
    }
  }, [handleJWAutoImport, isAppLoad, isAdmin, isLMMO, isAutoImportEnabled]);

  return <></>;
};

export default JWAutoImport;
