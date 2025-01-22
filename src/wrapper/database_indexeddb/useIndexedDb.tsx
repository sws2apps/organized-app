import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
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
  const setMeetingAttendance = useSetRecoilState(meetingAttendanceDbState);
  const setUserFieldServiceReports = useSetRecoilState(
    userFieldServiceReportsState
  );
  const setUserBibleStudies = useSetRecoilState(userBibleStudiesState);
  const setCongFieldServiceReports = useSetRecoilState(
    fieldServiceReportsState
  );
  const setBranchFieldReports = useSetRecoilState(
    branchFieldServiceReportsState
  );
  const setBranchCongAnalysis = useSetRecoilState(
    branchCongAnalysisReportsState
  );
  const setFieldGroups = useSetRecoilState(fieldServiceGroupsState);
  const setDbNotifications = useSetRecoilState(notificationsDbState);
  const setDelegatedFieldServiceReports = useSetRecoilState(
    delegatedFieldServiceReportsDbState
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
  };
};

export default useIndexedDb;
