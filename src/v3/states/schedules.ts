/*
This file holds the source of the truth from the table "sched".
*/

import { SchedWeekType } from '@definition/schedules';
import { atom } from 'recoil';

export const schedulesState = atom<SchedWeekType[]>({
  key: 'schedules',
  default: [],
});

export const isPublishOpenState = atom({
  key: 'isPublishOpen',
  default: false,
});

export const dlgAutoFillOpenState = atom({
  key: 'dlgAutoFillOpen',
  default: false,
});

export const isDeleteSchedState = atom({
  key: 'isDeleteSched',
  default: false,
});

export const dlgAssDeleteOpenState = atom({
  key: 'dlgAssDeleteOpen',
  default: false,
});

export const isAutoFillSchedState = atom({
  key: 'isAutoFillSched',
  default: false,
});

export const currentScheduleState = atom({
  key: 'currentSchedule',
  default: '',
});

export const s89DataState = atom({
  key: 's89Data',
  default: [],
});

export const S140DataState = atom({
  key: 'S140Data',
  default: [],
});

export const S140DownloadOpenState = atom({
  key: 'S140DownloadOpen',
  default: false,
});
