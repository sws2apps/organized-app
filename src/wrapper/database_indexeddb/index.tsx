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
    loadCongFieldServiceReports,
    loadBranchCongAnalysis,
    loadBranchFieldReports,
    loadFieldGroups,
    loadFieldServiceMeetings,
    loadDbNotifications,
    loadDbDelegatedReports,
    loadUpcomingEvents,
    loadPublicTalks,
    loadSongs,
  } = useIndexedDb();

  useEffect(() => {
    const refreshData = async () => {
      loadSongs();
      loadPublicTalks();
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
      loadCongFieldServiceReports();
      loadBranchFieldReports();
      loadBranchCongAnalysis();
      loadFieldGroups();
      loadFieldServiceMeetings();
      loadDbNotifications();
      loadDbDelegatedReports();
      loadUpcomingEvents();
    };

    refreshData();
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
    loadCongFieldServiceReports,
    loadBranchFieldReports,
    loadBranchCongAnalysis,
    loadFieldGroups,
    loadFieldServiceMeetings,
    loadDbNotifications,
    loadDbDelegatedReports,
    loadUpcomingEvents,
    loadPublicTalks,
    loadSongs,
  ]);

  return children;
};

export default DatabaseWrapper;
