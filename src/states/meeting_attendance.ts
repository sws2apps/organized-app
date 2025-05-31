/*
This file holds the source of the truth from the table "meetingAttendance".
*/

import { atom } from 'jotai';
import { MeetingAttendanceType } from '@definition/meeting_attendance';

export const meetingAttendanceDbState = atom<MeetingAttendanceType[]>([]);

export const meetingAttendanceState = atom((get) => {
  const attendance = get(meetingAttendanceDbState);

  const results = attendance.filter(
    (record) => !record._deleted || !record._deleted?.value
  );

  return results;
});
