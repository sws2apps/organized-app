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
import {
  adminRoleState,
  congRoleState,
  displayNameMeetingsEnableState,
  fullnameOptionState,
  userDataViewState,
  weekendMeetingWTStudyConductorDefaultState,
} from './settings';
import { personsState } from './persons';
import { buildPersonFullname } from '@utils/common';
import { userInLanguageGroupState } from './field_service_groups';

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

export const defaultWTStudyConductorNameState = atom((get) => {
  const value = get(weekendMeetingWTStudyConductorDefaultState);
  const useDisplayName = get(displayNameMeetingsEnableState);
  const persons = get(personsState);
  const fullnameOption = get(fullnameOptionState);

  if (value.length === 0) return '';

  const person = persons.find((record) => record.person_uid === value);

  if (!person) return '';

  let result = '';

  if (useDisplayName) {
    result = person.person_data.person_display_name.value;
  }

  if (!useDisplayName) {
    result = buildPersonFullname(
      person.person_data.person_lastname.value,
      person.person_data.person_firstname.value,
      fullnameOption
    );
  }

  return result;
});

export const isPublicTalkCoordinatorState = atom((get) => {
  const isAdmin = get(adminRoleState);
  const userRole = get(congRoleState);
  const user_in_group = get(userInLanguageGroupState);
  const dataView = get(userDataViewState);

  if (isAdmin) return true;

  const hasRole = userRole.includes('public_talk_schedule');

  if (!hasRole) return false;

  if (user_in_group && dataView === 'main') return false;

  return true;
});

export const isWeekendEditorState = atom((get) => {
  const isAdmin = get(adminRoleState);
  const userRole = get(congRoleState);
  const user_in_group = get(userInLanguageGroupState);
  const dataView = get(userDataViewState);

  if (isAdmin) return true;

  const hasRole = userRole.includes('weekend_schedule');

  if (!hasRole) return false;

  if (user_in_group && dataView === 'main') return false;

  return true;
});
