import { useEffect } from 'react';
import {
  dbBranchS1ReportsFill,
  dbFieldGroupAutoAssign,
  dbMeetingAttendanceFill,
  dbReportsFillRandom,
  dbSettingsAssignMainWTStudyConductor,
  importDummyPersons,
} from '@utils/dev';
import { dbAppDelete, dbAppOpen } from '@services/dexie/app';
import { dbAppSettingsBuildTest } from '@services/dexie/settings';
import { setIsAppLoad } from '@services/recoil/app';
import { loadApp, runUpdater } from '@services/app';
import { dbSpeakersCongregationsDummy } from '@services/dexie/speakers_congregations';
import { dbVisitingSpeakersDummy } from '@services/dexie/visiting_speakers';
import useInternetChecker from '@hooks/useInternetChecker';

const useStart = () => {
  const { isNavigatorOnline } = useInternetChecker();

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
      await dbFieldGroupAutoAssign();
      await dbReportsFillRandom();
      await dbMeetingAttendanceFill();
      await dbBranchS1ReportsFill();

      await loadApp();
      await runUpdater();

      await setIsAppLoad(false);
    };

    const timeOut = setTimeout(handlePrepareTest, 5000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [isNavigatorOnline]);

  return {};
};

export default useStart;
