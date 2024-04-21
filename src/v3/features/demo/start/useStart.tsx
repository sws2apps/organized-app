import { useEffect } from 'react';
import { importDummyPersons } from '@utils/dev';
import { dbAppDelete, dbAppOpen } from '@services/dexie/app';
import { dbAppSettingsBuildTest } from '@services/dexie/settings';
import { setIsAppLoad } from '@services/recoil/app';
import { loadApp, runUpdater } from '@services/app';

const useStart = () => {
  useEffect(() => {
    const handlePrepareTest = async () => {
      await dbAppDelete();
      await dbAppOpen();
      await importDummyPersons(false);
      await dbAppSettingsBuildTest();
      await loadApp();
      await runUpdater();

      await setIsAppLoad(false);
    };

    const timeOut = setTimeout(handlePrepareTest, 5000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  return {};
};

export default useStart;
