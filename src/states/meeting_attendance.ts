/*
This file holds the source of the truth from the table "meetingAttendance".
*/

import { atom } from 'jotai';
import { personsState } from '@states/persons';
import { settingsState, userLocalUIDState } from '@states/settings';
import { getAttendanceDataViews } from '@utils/meeting_attendance';
import {
  AttendanceSaveParams,
  MeetingAttendanceType,
} from '@definition/meeting_attendance';
import { meetingAttendancePresentSave } from '@services/app/meeting_attendance';

export const meetingAttendanceDbState = atom<MeetingAttendanceType[]>([]);

export const attendanceEditableViewsState = atom((get) => {
  const userUID = get(userLocalUIDState);
  const person = get(personsState).find((row) => row.person_uid === userUID);
  const roles = get(settingsState).user_settings.cong_role;
  return getAttendanceDataViews(person, roles);
});

export const meetingAttendanceSaveState = atom(
  null,
  (get, _set, params: AttendanceSaveParams) => {
    const views = get(attendanceEditableViewsState);
    if (views !== undefined && !views.includes(params.dataView)) return false;
    return meetingAttendancePresentSave(params);
  }
);

export const meetingAttendanceState = atom((get) => {
  const attendance = get(meetingAttendanceDbState);

  const results = attendance.filter(
    (record) => !record._deleted || !record._deleted?.value
  );

  return results;
});
