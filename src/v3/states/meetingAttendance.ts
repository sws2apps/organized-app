/*
This file holds the source of the truth from the table "meetingAttendance".
*/

import { atom } from 'recoil';

export const meetingAttendanceState = atom({
  key: 'meetingAttendance',
  default: [],
});
