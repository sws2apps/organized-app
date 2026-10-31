/*
This file will be the entry to get the live update from IndexedDb using dexie hooks
*/

import { PropsWithChildren, useEffect } from 'react';
import useIndexedDb from './useIndexedDb';
import usePartnerRequests from '@features/app_notification/container/usePartnerRequests';

const DatabaseWrapper = ({ children }: PropsWithChildren) => {
  usePartnerRequests();
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
    loadDbNotifications,
    loadDbDelegatedReports,
    loadUpcomingEvents,
    loadPublicTalks,
    loadSongs,
    loadAppLocals,
    loadPreachingPartnerRequests,
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
      loadDbNotifications();
      loadDbDelegatedReports();
      loadUpcomingEvents();
      loadAppLocals();
      loadPreachingPartnerRequests();
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
    loadDbNotifications,
    loadDbDelegatedReports,
    loadUpcomingEvents,
    loadPublicTalks,
    loadSongs,
    loadAppLocals,
    loadPreachingPartnerRequests,
  ]);

  return children;
};

export default DatabaseWrapper;
