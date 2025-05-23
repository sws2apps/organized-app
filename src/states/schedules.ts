/*
This file holds the source of the truth from the table "sched".
*/

import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';
import {
  AssignmentHistoryType,
  MidweekMeetingDataType,
  S140TemplateType,
  S89DataType,
  S89TemplateType,
  SchedWeekType,
} from '@definition/schedules';

export const schedulesState = atom<SchedWeekType[]>([]);

export const isPublishOpenState = atom(false);

export const dlgAutoFillOpenState = atom(false);

export const isDeleteSchedState = atom(false);

export const dlgAssDeleteOpenState = atom(false);

export const isAutoFillSchedState = atom(false);

export const currentScheduleState = atom('');

export const s89DataState = atom<S89DataType[]>([]);

export const S140DataState = atom<MidweekMeetingDataType[]>([]);

export const S140DownloadOpenState = atom(false);

export const selectedWeekState = atomWithReset('');

export const assignmentsHistoryState = atom<AssignmentHistoryType[]>([]);

export const weekendSongSelectorOpenState = atom(false);

export const outgoingSongSelectorOpenState = atom(false);

export const S140TemplateState = atom<S140TemplateType>(
  (localStorage.getItem('organized_template_S140') as S140TemplateType) ||
    'S140_default'
);

export const S89TemplateState = atom<S89TemplateType>(
  (localStorage.getItem('organized_template_S89') as S89TemplateType) ||
    'S89_1x1'
);
