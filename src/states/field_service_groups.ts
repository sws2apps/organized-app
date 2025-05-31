/*
This file holds the source of the truth from the table "fieldServiceGroup".
*/

import { atom } from 'jotai';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import { personsActiveState } from './persons';
import { congNameState, isElderState, userDataViewState } from './settings';
import {
  personIsMidweekStudent,
  personIsPublisher,
} from '@services/app/persons';

export const fieldServiceGroupsState = atom<FieldServiceGroupType[]>([]);

export const fieldWithLanguageGroupsState = atom((get) => {
  const groups = get(fieldServiceGroupsState);
  const persons = get(personsActiveState);
  const isElder = get(isElderState);

  const validGroups = groups
    .filter((record) => !record.group_data._deleted)
    .sort((a, b) => a.group_data.sort_index - b.group_data.sort_index);

  // remove deleted persons and add elder filter
  const result = validGroups.map((record) => {
    const group = structuredClone(record);

    group.group_data.members = group.group_data.members.filter((member) => {
      if (isElder) return true;

      const person = persons.find(
        (person) => person.person_uid === member.person_uid
      );

      if (!person) return false;

      return personIsPublisher(person);
    });

    return group;
  });

  return result;
});

export const fieldWithLanguageGroupsNoStudentsState = atom((get) => {
  const groups = get(fieldWithLanguageGroupsState);
  const persons = get(personsActiveState);

  const dataGroup = structuredClone(groups);

  return dataGroup.map((group) => {
    group.group_data.members = group.group_data.members.filter((member) => {
      const person = persons.find(
        (person) => person.person_uid === member.person_uid
      );

      if (!person) return false;

      return !personIsMidweekStudent(person);
    });

    return group;
  });
});

export const fieldGroupsState = atom((get) => {
  const groups = get(fieldWithLanguageGroupsState);

  return groups.filter((record) => !record.group_data.language_group);
});

export const languageGroupsState = atom((get) => {
  const groups = get(fieldWithLanguageGroupsState);

  return groups.filter((record) => record.group_data.language_group);
});

export const headerForScheduleState = atom((get) => {
  const congName = get(congNameState);
  const dataView = get(userDataViewState);
  const groups = get(languageGroupsState);

  if (dataView === 'main') return congName;

  const group = groups.find((record) => record.group_id === dataView);

  return group?.group_data.name ?? '';
});
