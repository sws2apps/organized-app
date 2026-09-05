/*
This file holds the source of the truth from the table "meetingAttendance".
*/

import { atom } from 'jotai';
import {
  AttendanceSaveParams,
  MeetingAttendanceType,
} from '@definition/meeting_attendance';
import { meetingAttendancePresentSave } from '@services/app/meeting_attendance';

export const meetingAttendanceDbState = atom<MeetingAttendanceType[]>([]);

export const meetingAttendanceSaveState = atom(
  null,
  (_get, _set, params: AttendanceSaveParams) =>
    meetingAttendancePresentSave(params)
);

export const meetingAttendanceState = atom((get) => {
  const attendance = get(meetingAttendanceDbState);

  const results = attendance.filter(
    (record) => !record._deleted || !record._deleted?.value
  );

  return results;
});
