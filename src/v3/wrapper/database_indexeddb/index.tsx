/*
This file will be the entry to get the live update from IndexedDb using dexie hooks
*/

import { ReactNode, useEffect } from 'react';
import useIndexedDb from './useIndexedDb';

const DatabaseWrapper = ({ children }: { children?: ReactNode }) => {
  const {
    loadSettings,
    loadAnnouncements,
    loadAssignment,
    loadBranchReports,
    loadFieldServiceGroup,
    loadFieldServiceReports,
    loadLateReports,
    loadMeetingAttendance,
    loadMinutesReports,
    loadPersons,
    loadPublicTalks,
    loadSchedules,
    loadServiceYear,
    loadSources,
    loadUserBibleStudies,
    loadUserFieldServiceReports,
    loadVisitingSpeakers,
    loadWeekType,
  } = useIndexedDb();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  useEffect(() => {
    loadAssignment();
  }, [loadAssignment]);

  useEffect(() => {
    loadBranchReports();
  }, [loadBranchReports]);

  useEffect(() => {
    loadFieldServiceGroup();
  }, [loadFieldServiceGroup]);

  useEffect(() => {
    loadFieldServiceReports();
  }, [loadFieldServiceReports]);

  useEffect(() => {
    loadLateReports();
  }, [loadLateReports]);

  useEffect(() => {
    loadMeetingAttendance();
  }, [loadMeetingAttendance]);

  useEffect(() => {
    loadMinutesReports();
  }, [loadMinutesReports]);

  useEffect(() => {
    loadPersons();
  }, [loadPersons]);

  useEffect(() => {
    loadPublicTalks();
  }, [loadPublicTalks]);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  useEffect(() => {
    loadServiceYear();
  }, [loadServiceYear]);

  useEffect(() => {
    loadUserBibleStudies();
  }, [loadUserBibleStudies]);

  useEffect(() => {
    loadUserFieldServiceReports();
  }, [loadUserFieldServiceReports]);

  useEffect(() => {
    loadVisitingSpeakers();
  }, [loadVisitingSpeakers]);

  useEffect(() => {
    loadWeekType();
  }, [loadWeekType]);

  useEffect(() => {
    loadSources();
  }, [loadSources]);

  return <>{children}</>;
};

export default DatabaseWrapper;
