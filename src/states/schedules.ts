/*
This file holds the source of the truth from the table "sched".
*/

import { atom } from 'recoil';
import {
  AssignmentHistoryType,
  S140TemplateType,
  S89TemplateType,
  SchedWeekType,
} from '@definition/schedules';

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

export const selectedWeekState = atom({
  key: 'selectedWeek',
  default: '',
});

export const assignmentsHistoryState = atom<AssignmentHistoryType[]>({
  key: 'assignmentsHistory',
  default: [],
});

export const weekendSongSelectorOpenState = atom({
  key: 'weekendSongSelectorOpen',
  default: false,
});

export const outgoingSongSelectorOpenState = atom({
  key: 'outgoingSongSelectorOpen',
  default: false,
});

export const S140TemplateState = atom<S140TemplateType>({
  key: 'S140Template',
  default:
    (localStorage.getItem('organized_template_S140') as S140TemplateType) ||
    'S140_default',
});

export const S89TemplateState = atom<S89TemplateType>({
  key: 'S89Template',
  default:
    (localStorage.getItem('organized_template_S89') as S89TemplateType) ||
    'S89_1x1',
});
