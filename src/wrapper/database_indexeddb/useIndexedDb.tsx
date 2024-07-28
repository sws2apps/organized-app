import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { useLiveQuery } from 'dexie-react-hooks';
import { settingsState } from '@states/settings';
import { personsState } from '@states/persons';
import { weekTypeState } from '@states/weekType';
import { assignmentState } from '@states/assignment';
import { sourcesState } from '@states/sources';
import { schedulesState } from '@states/schedules';
import { visitingSpeakersState } from '@states/visiting_speakers';
import { speakersCongregationsState } from '@states/speakers_congregations';
import appDb from '@db/appDb';

const useIndexedDb = () => {
  const dbSettings = useLiveQuery(() => appDb.app_settings.toArray());
  const dbPersons = useLiveQuery(() => appDb.persons.toArray());
  const dbWeekType = useLiveQuery(() => appDb.week_type.toArray());
  const dbAssignment = useLiveQuery(() => appDb.assignment.toArray());
  const dbSources = useLiveQuery(() => appDb.sources.toArray());
  const dbSchedules = useLiveQuery(() => appDb.sched.toArray());
  const dbSpeakersCongregations = useLiveQuery(() =>
    appDb.speakers_congregations.toArray()
  );
  const dbVisitingSpeakers = useLiveQuery(() =>
    appDb.visiting_speakers.toArray()
  );

  const setSettings = useSetRecoilState(settingsState);
  const setPersons = useSetRecoilState(personsState);
  const setWeekType = useSetRecoilState(weekTypeState);
  const setAssignment = useSetRecoilState(assignmentState);
  const setSources = useSetRecoilState(sourcesState);
  const setSchedules = useSetRecoilState(schedulesState);
  const setVisitingSpeakers = useSetRecoilState(visitingSpeakersState);
  const setSpeakersCongregations = useSetRecoilState(
    speakersCongregationsState
  );

  const loadSettings = useCallback(() => {
    if (dbSettings && dbSettings[0]) {
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

  const loadVisitingSpeakers = useCallback(() => {
    if (dbVisitingSpeakers) {
      setVisitingSpeakers(dbVisitingSpeakers);
    }
  }, [dbVisitingSpeakers, setVisitingSpeakers]);

  const loadSpeakersCongregations = useCallback(() => {
    if (dbSpeakersCongregations) {
      setSpeakersCongregations(dbSpeakersCongregations);
    }
  }, [dbSpeakersCongregations, setSpeakersCongregations]);

  return {
    loadSettings,
    loadPersons,
    loadWeekType,
    loadAssignment,
    loadSources,
    loadSchedules,
    loadVisitingSpeakers,
    loadSpeakersCongregations,
  };
};

export default useIndexedDb;
