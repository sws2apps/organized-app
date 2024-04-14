import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { useLiveQuery } from 'dexie-react-hooks';
import { settingsState } from '@states/settings';
import { personsState } from '@states/persons';
import { weekTypeState } from '@states/weekType';
import { assignmentState } from '@states/assignment';
import { publicTalksState } from '@states/publicTalks';
import { sourcesState } from '@states/sources';
import { schedulesState } from '@states/schedules';
import appDb from '@shared/indexedDb/appDb';

const useIndexedDb = () => {
  const dbSettings = useLiveQuery(() => appDb.app_settings.toArray());
  const dbPersons = useLiveQuery(() => appDb.persons.toArray());
  const dbWeekType = useLiveQuery(() => appDb.week_type.toArray());
  const dbAssignment = useLiveQuery(() => appDb.assignment.toArray());
  const dbPublicTalks = useLiveQuery(() => appDb.public_talks.toArray());
  const dbSources = useLiveQuery(() => appDb.sources.toArray());
  const dbSchedules = useLiveQuery(() => appDb.sched.toArray());

  const setSettings = useSetRecoilState(settingsState);
  const setPersons = useSetRecoilState(personsState);
  const setWeekType = useSetRecoilState(weekTypeState);
  const setAssignment = useSetRecoilState(assignmentState);
  const setPublicTalks = useSetRecoilState(publicTalksState);
  const setSources = useSetRecoilState(sourcesState);
  const setSchedules = useSetRecoilState(schedulesState);

  const loadSettings = useCallback(async () => {
    if (dbSettings && dbSettings[0] && dbSettings[0].id === 1) {
      setSettings(dbSettings[0]);
    }
  }, [dbSettings, setSettings]);

  const loadPersons = useCallback(() => {
    if (dbPersons) {
      setPersons(dbPersons);
    }
  }, [dbPersons, setPersons]);

  const loadWeekType = useCallback(() => {
    if (dbWeekType) {
      setWeekType(dbWeekType);
    }
  }, [dbWeekType, setWeekType]);

  const loadAssignment = useCallback(() => {
    if (dbAssignment) {
      setAssignment(dbAssignment);
    }
  }, [dbAssignment, setAssignment]);

  const loadPublicTalks = useCallback(() => {
    if (dbPublicTalks) {
      setPublicTalks(dbPublicTalks);
    }
  }, [dbPublicTalks, setPublicTalks]);

  const loadSources = useCallback(() => {
    if (dbSources) {
      setSources(dbSources);
    }
  }, [dbSources, setSources]);

  const loadSchedules = useCallback(() => {
    if (dbSchedules) {
      setSchedules(dbSchedules);
    }
  }, [dbSchedules, setSchedules]);

  return {
    loadSettings,
    loadPersons,
    loadWeekType,
    loadAssignment,
    loadPublicTalks,
    loadSources,
    loadSchedules,
  };
};

export default useIndexedDb;
