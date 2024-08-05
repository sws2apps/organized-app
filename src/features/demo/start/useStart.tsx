import { useEffect } from 'react';
import {
  dbSettingsAssignMainWTStudyConductor,
  importDummyPersons,
} from '@utils/dev';
import { dbAppDelete, dbAppOpen } from '@services/dexie/app';
import { dbAppSettingsBuildTest } from '@services/dexie/settings';
import { setIsAppLoad } from '@services/recoil/app';
import { loadApp, runUpdater } from '@services/app';
import { dbSpeakersCongregationsDummy } from '@services/dexie/speakers_congregations';
import { dbVisitingSpeakersDummy } from '@services/dexie/visiting_speakers';
import { apiFetchSources } from '@services/api/sources';
import { sourcesImportJW } from '@services/app/sources';

const useStart = () => {
  useEffect(() => {
    document.title = 'Test Organized app (sws2apps)';

    const handlePrepareTest = async () => {
      await dbAppDelete();
      await dbAppOpen();
      await importDummyPersons(false);
      await dbAppSettingsBuildTest();
      await dbSpeakersCongregationsDummy();
      await dbVisitingSpeakersDummy();
      await dbSettingsAssignMainWTStudyConductor();

      await loadApp();
      await runUpdater();

      const { data, status } = await apiFetchSources();
      if (status === 200 && data && data.length) {
        await sourcesImportJW(data);
      }

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
