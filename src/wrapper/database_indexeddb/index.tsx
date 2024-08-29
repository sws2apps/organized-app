/*
This file will be the entry to get the live update from IndexedDb using dexie hooks
*/

import { PropsWithChildren, useEffect } from 'react';
import useIndexedDb from './useIndexedDb';

const DatabaseWrapper = ({ children }: PropsWithChildren) => {
  const {
    loadSettings,
    loadAssignment,
    loadPersons,
    loadSchedules,
    loadSources,
    loadWeekType,
    loadVisitingSpeakers,
    loadSpeakersCongregations,
    loadMeetingAttendance,
    loadUserFieldServiceReports,
    loadUserBibleStudies,
  } = useIndexedDb();

  useEffect(() => {
    loadSettings();
    loadAssignment();
    loadPersons();
    loadSchedules();
    loadWeekType();
    loadSources();
    loadSpeakersCongregations();
    loadVisitingSpeakers();
    loadMeetingAttendance();
    loadUserBibleStudies();
    loadUserFieldServiceReports();
  }, [
    loadSettings,
    loadAssignment,
    loadPersons,
    loadSchedules,
    loadWeekType,
    loadSources,
    loadSpeakersCongregations,
    loadVisitingSpeakers,
    loadMeetingAttendance,
    loadUserFieldServiceReports,
    loadUserBibleStudies,
  ]);

  return children;
};

export default DatabaseWrapper;
