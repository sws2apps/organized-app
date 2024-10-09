import { useCallback, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { isDemo } from '@constants/index';
import { isAppLoadState } from '@states/app';
import { sourcesJWAutoImportState } from '@states/settings';
import { apiFetchSources } from '@services/api/sources';
import { sourcesImportJW } from '@services/app/sources';
import useInternetChecker from '@hooks/useInternetChecker';
import useCurrentUser from '@hooks/useCurrentUser';

const JWAutoImport = () => {
  const { isNavigatorOnline } = useInternetChecker();

  const { isMidweekEditor } = useCurrentUser();

  const isAppLoad = useRecoilValue(isAppLoadState);
  const isAutoImportEnabled = useRecoilValue(sourcesJWAutoImportState);

  const handleJWAutoImport = useCallback(async () => {
    const { data, status } = await apiFetchSources();
    if (status === 200 && data?.length) {
      await sourcesImportJW(data);
    }
  }, []);

  useEffect(() => {
    if (!isAppLoad && isNavigatorOnline) {
      if (isDemo) {
        handleJWAutoImport();
      }

      if (!isDemo && isMidweekEditor && isAutoImportEnabled) {
        const now = new Date().toISOString();
        const nextSync = localStorage.getItem('organized_jw_import_next_sync');

        if (!nextSync || (nextSync && nextSync <= now)) {
          handleJWAutoImport();
        }
      }
    }
  }, [
    handleJWAutoImport,
    isAppLoad,
    isAutoImportEnabled,
    isNavigatorOnline,
    isMidweekEditor,
  ]);

  return <></>;
};

export default JWAutoImport;
