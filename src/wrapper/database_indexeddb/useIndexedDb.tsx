import { useCallback } from 'react';
import { useSetAtom } from 'jotai';
import { useLiveQuery } from 'dexie-react-hooks';
import appDb from '@db/appDb';

import { settingsState } from '@states/settings';
import { personsState } from '@states/persons';
import { weekTypeState } from '@states/weekType';
import { assignmentState } from '@states/assignment';
import { sourcesState } from '@states/sources';
import { schedulesState } from '@states/schedules';
import { visitingSpeakersState } from '@states/visiting_speakers';
import { speakersCongregationsState } from '@states/speakers_congregations';
import { meetingAttendanceDbState } from '@states/meeting_attendance';
import { userFieldServiceReportsState } from '@states/user_field_service_reports';
import { userBibleStudiesState } from '@states/user_bible_studies';
import { fieldServiceReportsState } from '@states/field_service_reports';
import { branchFieldServiceReportsState } from '@states/branch_field_service_reports';
import { branchCongAnalysisReportsState } from '@states/branch_cong_analysis';
import { fieldServiceGroupsState } from '@states/field_service_groups';
import { notificationsDbState } from '@states/notification';
import { delegatedFieldServiceReportsDbState } from '@states/delegated_field_service_reports';
import { upcomingEventsDbState } from '@states/upcoming_events';
import { publicTalksState } from '@states/public_talks';
import { songsState } from '@states/songs';

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
  const dbMeetingAttendance = useLiveQuery(() =>
    appDb.meeting_attendance.toArray()
  );
  const dbUserBibleStudies = useLiveQuery(() =>
    appDb.user_bible_studies.toArray()
  );
  const dbUserFieldServiceReports = useLiveQuery(() =>
    appDb.user_field_service_reports.toArray()
  );
  const dbCongFieldServiceReports = useLiveQuery(() =>
    appDb.cong_field_service_reports.toArray()
  );
  const dbBranchFieldReports = useLiveQuery(() =>
    appDb.branch_field_service_reports.toArray()
  );
  const dbBranchCongAnalysis = useLiveQuery(() =>
    appDb.branch_cong_analysis.toArray()
  );
  const dbFieldGroups = useLiveQuery(() =>
    appDb.field_service_groups.toArray()
  );
  const dbNotifications = useLiveQuery(() => appDb.notification.toArray());
  const dbDelegatedFieldServiceReports = useLiveQuery(() =>
    appDb.delegated_field_service_reports.toArray()
  );
  const dbUpcomingEvents = useLiveQuery(() => appDb.upcoming_events.toArray());
  const dbPublicTalks = useLiveQuery(() => appDb.public_talks.toArray());
  const dbSongs = useLiveQuery(() => appDb.songs.toArray());

  const setSettings = useSetAtom(settingsState);
  const setPersons = useSetAtom(personsState);
  const setWeekType = useSetAtom(weekTypeState);
  const setAssignment = useSetAtom(assignmentState);
  const setSources = useSetAtom(sourcesState);
  const setSchedules = useSetAtom(schedulesState);
  const setVisitingSpeakers = useSetAtom(visitingSpeakersState);
  const setSpeakersCongregations = useSetAtom(speakersCongregationsState);
  const setMeetingAttendance = useSetAtom(meetingAttendanceDbState);
  const setUserFieldServiceReports = useSetAtom(userFieldServiceReportsState);
  const setUserBibleStudies = useSetAtom(userBibleStudiesState);
  const setCongFieldServiceReports = useSetAtom(fieldServiceReportsState);
  const setBranchFieldReports = useSetAtom(branchFieldServiceReportsState);
  const setBranchCongAnalysis = useSetAtom(branchCongAnalysisReportsState);
  const setFieldGroups = useSetAtom(fieldServiceGroupsState);
  const setDbNotifications = useSetAtom(notificationsDbState);
  const setDelegatedFieldServiceReports = useSetAtom(
    delegatedFieldServiceReportsDbState
  );
  const setUpcomingEvents = useSetAtom(upcomingEventsDbState);
  const setPublicTalks = useSetAtom(publicTalksState);
  const setSongs = useSetAtom(songsState);

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

  const loadMeetingAttendance = useCallback(() => {
    if (dbMeetingAttendance) {
      setMeetingAttendance(dbMeetingAttendance);
    }
  }, [dbMeetingAttendance, setMeetingAttendance]);

  const loadUserFieldServiceReports = useCallback(() => {
    if (dbUserFieldServiceReports) {
      setUserFieldServiceReports(dbUserFieldServiceReports);
    }
  }, [dbUserFieldServiceReports, setUserFieldServiceReports]);

  const loadUserBibleStudies = useCallback(() => {
    if (dbUserBibleStudies) {
      setUserBibleStudies(dbUserBibleStudies);
    }
  }, [dbUserBibleStudies, setUserBibleStudies]);

  const loadCongFieldServiceReports = useCallback(() => {
    if (dbCongFieldServiceReports) {
      setCongFieldServiceReports(dbCongFieldServiceReports);
    }
  }, [dbCongFieldServiceReports, setCongFieldServiceReports]);

  const loadBranchFieldReports = useCallback(() => {
    if (dbBranchFieldReports) {
      setBranchFieldReports(dbBranchFieldReports);
    }
  }, [dbBranchFieldReports, setBranchFieldReports]);

  const loadBranchCongAnalysis = useCallback(() => {
    if (dbBranchCongAnalysis) {
      setBranchCongAnalysis(dbBranchCongAnalysis);
    }
  }, [dbBranchCongAnalysis, setBranchCongAnalysis]);

  const loadFieldGroups = useCallback(() => {
    if (dbFieldGroups) {
      setFieldGroups(dbFieldGroups);
    }
  }, [dbFieldGroups, setFieldGroups]);

  const loadDbNotifications = useCallback(() => {
    if (dbNotifications) {
      setDbNotifications(dbNotifications);
    }
  }, [dbNotifications, setDbNotifications]);

  const loadDbDelegatedReports = useCallback(() => {
    if (dbDelegatedFieldServiceReports) {
      setDelegatedFieldServiceReports(dbDelegatedFieldServiceReports);
    }
  }, [dbDelegatedFieldServiceReports, setDelegatedFieldServiceReports]);

  const loadUpcomingEvents = useCallback(() => {
    if (dbUpcomingEvents) {
      setUpcomingEvents(dbUpcomingEvents);
    }
  }, [dbUpcomingEvents, setUpcomingEvents]);

  const loadPublicTalks = useCallback(() => {
    if (dbPublicTalks) {
      setPublicTalks(dbPublicTalks);
    }
  }, [dbPublicTalks, setPublicTalks]);

  const loadSongs = useCallback(() => {
    if (dbSongs) {
      setSongs(dbSongs);
    }
  }, [dbSongs, setSongs]);

  return {
    loadSettings,
    loadPersons,
    loadWeekType,
    loadAssignment,
    loadSources,
    loadSchedules,
    loadVisitingSpeakers,
    loadSpeakersCongregations,
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
  };
};

export default useIndexedDb;
