/*
This file holds the source of the truth from the table "meetingAttendance".
*/

import { atom } from 'recoil';
import { MeetingAttendanceType } from '@definition/meeting_attendance';

export const meetingAttendanceState = atom<MeetingAttendanceType[]>({
  key: 'meetingAttendance',
  default: [],
});
