/*
This file holds the source of the truth from the table "meetingAttendance".
*/

import { atom, selector } from 'recoil';
import { MeetingAttendanceType } from '@definition/meeting_attendance';

export const meetingAttendanceDbState = atom<MeetingAttendanceType[]>({
  key: 'meetingAttendanceDb',
  default: [],
});

export const meetingAttendanceState = selector({
  key: 'meetingAttendance',
  get: ({ get }) => {
    const attendance = get(meetingAttendanceDbState);

    const results = attendance.filter(
      (record) => !record._deleted || !record._deleted?.value
    );

    return results;
  },
});
