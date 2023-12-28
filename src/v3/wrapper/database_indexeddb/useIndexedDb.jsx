import { useSetRecoilState } from 'recoil';
import { useLiveQuery } from 'dexie-react-hooks';
import { appDb } from '@services/dexie';
import { settingsState } from '@states/settings';
import { personsState } from '@states/persons';
import { weekTypeState } from '@states/weekType';
import { assignmentState } from '@states/assignment';
import { announcementsState } from '@states/announcements';
import { fieldServiceGroupState } from '@states/fieldServiceGroup';
import { serviceYearState } from '@states/serviceYear';
import { meetingAttendanceState } from '@states/meetingAttendance';
import { fieldServiceReportsState } from '@states/fieldServiceReports';
import { branchReportsState } from '@states/branchReports';
import { minutesReportsState } from '@states/minutesReports';
import { lateReportsState } from '@states/lateReports';
import { userBibleStudiesState } from '@states/userBibleStudies';
import { userFieldServiceReportsState } from '@states/userFieldServiceReports';
import { publicTalksState } from '@states/publicTalks';
import { visitingSpeakersState } from '@states/visitingSpeakers';
import { sourcesState } from '@states/sources';
import { schedulesState } from '@states/schedules';
import { useCallback } from 'react';

const useIndexedDb = () => {
  const dbSettings = useLiveQuery(() => appDb.app_settings.toArray());
  const dbPersons = useLiveQuery(() => appDb.persons.toArray());
  const dbWeekType = useLiveQuery(() => appDb.week_type.toArray());
  const dbAssignment = useLiveQuery(() => appDb.assignment.toArray());
  const dbAnnoucements = useLiveQuery(() => appDb.announcements.toArray());
  const dbFieldServiceGroup = useLiveQuery(() => appDb.fieldServiceGroup.toArray());
  const dbServiceYear = useLiveQuery(() => appDb.serviceYear.toArray());
  const dbMeetingAttendance = useLiveQuery(() => appDb.meetingAttendance.toArray());
  const dbFieldServiceReports = useLiveQuery(() => appDb.fieldServiceReports.toArray());
  const dbBranchReports = useLiveQuery(() => appDb.branchReports.toArray());
  const dbMinutesReports = useLiveQuery(() => appDb.minutesReports.toArray());
  const dbLateReports = useLiveQuery(() => appDb.lateReports.toArray());
  const dbUserBibleStudies = useLiveQuery(() => appDb.user_bible_studies.toArray());
  const dbUserFieldServiceReports = useLiveQuery(() => appDb.user_field_service_reports.toArray());
  const dbPublicTalks = useLiveQuery(() => appDb.public_talks.toArray());
  const dbVisitingSpeakers = useLiveQuery(() => appDb.visiting_speakers.toArray());
  const dbSources = useLiveQuery(() => appDb.sources.toArray());
  const dbSchedules = useLiveQuery(() => appDb.sched.toArray());

  const setSettings = useSetRecoilState(settingsState);
  const setPersons = useSetRecoilState(personsState);
  const setWeekType = useSetRecoilState(weekTypeState);
  const setAssignment = useSetRecoilState(assignmentState);
  const setAnnouncements = useSetRecoilState(announcementsState);
  const setFieldServiceGroup = useSetRecoilState(fieldServiceGroupState);
  const setServiceYear = useSetRecoilState(serviceYearState);
  const setMeetingAttendance = useSetRecoilState(meetingAttendanceState);
  const setFieldServiceReports = useSetRecoilState(fieldServiceReportsState);
  const setBranchReports = useSetRecoilState(branchReportsState);
  const setMinutesReports = useSetRecoilState(minutesReportsState);
  const setLateReports = useSetRecoilState(lateReportsState);
  const setUserBibleStudies = useSetRecoilState(userBibleStudiesState);
  const setUserFieldServiceReports = useSetRecoilState(userFieldServiceReportsState);
  const setPublicTalks = useSetRecoilState(publicTalksState);
  const setVisitingSpeakers = useSetRecoilState(visitingSpeakersState);
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

  const loadAnnouncements = useCallback(() => {
    if (dbAnnoucements) {
      setAnnouncements(dbAnnoucements);
    }
  }, [dbAnnoucements, setAnnouncements]);

  const loadFieldServiceGroup = useCallback(() => {
    if (dbFieldServiceGroup) {
      setFieldServiceGroup(dbFieldServiceGroup);
    }
  }, [dbFieldServiceGroup, setFieldServiceGroup]);

  const loadServiceYear = useCallback(() => {
    if (dbServiceYear) {
      setServiceYear(dbServiceYear);
    }
  }, [dbServiceYear, setServiceYear]);

  const loadMeetingAttendance = useCallback(() => {
    if (dbMeetingAttendance) {
      setMeetingAttendance(dbMeetingAttendance);
    }
  }, [dbMeetingAttendance, setMeetingAttendance]);

  const loadFieldServiceReports = useCallback(() => {
    if (dbFieldServiceReports) {
      setFieldServiceReports(dbFieldServiceReports);
    }
  }, [dbFieldServiceReports, setFieldServiceReports]);

  const loadBranchReports = useCallback(() => {
    if (dbBranchReports) {
      setBranchReports(dbBranchReports);
    }
  }, [dbBranchReports, setBranchReports]);

  const loadMinutesReports = useCallback(() => {
    if (dbMinutesReports) {
      setMinutesReports(dbMinutesReports);
    }
  }, [dbMinutesReports, setMinutesReports]);

  const loadLateReports = useCallback(() => {
    if (dbLateReports) {
      setLateReports(dbLateReports);
    }
  }, [dbLateReports, setLateReports]);

  const loadUserBibleStudies = useCallback(() => {
    if (dbUserBibleStudies) {
      setUserBibleStudies(dbUserBibleStudies);
    }
  }, [dbUserBibleStudies, setUserBibleStudies]);

  const loadUserFieldServiceReports = useCallback(() => {
    if (dbUserFieldServiceReports) {
      setUserFieldServiceReports(dbUserFieldServiceReports);
    }
  }, [dbUserFieldServiceReports, setUserFieldServiceReports]);

  const loadPublicTalks = useCallback(() => {
    if (dbPublicTalks) {
      setPublicTalks(dbPublicTalks);
    }
  }, [dbPublicTalks, setPublicTalks]);

  const loadVisitingSpeakers = useCallback(() => {
    if (dbVisitingSpeakers) {
      setVisitingSpeakers(dbVisitingSpeakers);
    }
  }, [dbVisitingSpeakers, setVisitingSpeakers]);

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
    loadAnnouncements,
    loadFieldServiceGroup,
    loadServiceYear,
    loadMeetingAttendance,
    loadFieldServiceReports,
    loadBranchReports,
    loadMinutesReports,
    loadLateReports,
    loadUserBibleStudies,
    loadUserFieldServiceReports,
    loadPublicTalks,
    loadVisitingSpeakers,
    loadSources,
    loadSchedules,
  };
};

export default useIndexedDb;
