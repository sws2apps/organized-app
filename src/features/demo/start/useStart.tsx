import { useEffect } from 'react';
import {
  dbBranchS1ReportsFill,
  dbFieldGroupAutoAssign,
  dbFieldServiceMeetingsDummy,
  dbMeetingAttendanceFill,
  dbReportsFillRandom,
  dbSchedulesAutoFill,
  dbSettingsAssignMainWTStudyConductor,
  importDummyPersons,
} from '@utils/dev';
import { dbAppDelete, dbAppOpen } from '@services/dexie/app';
import { dbAppSettingsBuildTest } from '@services/dexie/settings';
import { setIsAppLoad } from '@services/states/app';
import { loadApp, runUpdater } from '@services/app';
import { dbSpeakersCongregationsDummy } from '@services/dexie/speakers_congregations';
import { dbVisitingSpeakersDummy } from '@services/dexie/visiting_speakers';
import { apiFetchSources } from '@services/api/sources';
import { sourcesImportJW } from '@services/app/sources';
import { dbSongUpdate } from '@services/dexie/songs';
import { dbPublicTalkUpdate } from '@services/dexie/public_talk';
import { dbWeekTypeUpdate } from '@services/dexie/weekType';
import { dbAssignmentUpdate } from '@services/dexie/assignment';
import { TIMER_KEY } from '@constants/index';
import useInternetChecker from '@hooks/useInternetChecker';
import { dbPersonsAssignFamilyHeads } from '@services/dexie/persons';

const useStart = () => {
  const { isNavigatorOnline } = useInternetChecker();

  useEffect(() => {
    document.title = 'Test Organized app (sws2apps)';

    const handlePrepareTest = async () => {
      localStorage.removeItem(TIMER_KEY);

      await dbAppDelete();
      await dbAppOpen();

      await dbSongUpdate();
      await dbPublicTalkUpdate();
      await dbWeekTypeUpdate();
      await dbAssignmentUpdate();
      await importDummyPersons(false);
      await dbAppSettingsBuildTest();
      await dbSpeakersCongregationsDummy();
      await dbVisitingSpeakersDummy();
      await dbSettingsAssignMainWTStudyConductor();
      await dbFieldGroupAutoAssign();
      await dbFieldServiceMeetingsDummy();
      await dbReportsFillRandom();
      await dbMeetingAttendanceFill();
      await dbBranchS1ReportsFill();
      await dbPersonsAssignFamilyHeads();

      if (isNavigatorOnline) {
        const { data, status } = await apiFetchSources();
        if (status === 200 && data?.length) {
          await sourcesImportJW(data);
          await dbSchedulesAutoFill();
        }
      }

      await runUpdater();

      loadApp();

      setIsAppLoad(false);
    };

    const timeOut = setTimeout(handlePrepareTest, 5000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [isNavigatorOnline]);

  return {};
};

export default useStart;
