/*
This file holds the source of the truth from the table "fieldServiceGroup".
*/

import { atom } from 'jotai';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import { personsActiveState } from './persons';

export const fieldServiceGroupsState = atom<FieldServiceGroupType[]>([]);

export const fieldGroupsState = atom((get) => {
  const groups = get(fieldServiceGroupsState);
  const persons = get(personsActiveState);

  const validGroups = groups
    .filter((record) => !record.group_data._deleted)
    .sort((a, b) => a.group_data.sort_index - b.group_data.sort_index);

  // remove deleted persons
  const result = validGroups.map((record) => {
    record.group_data.members = record.group_data.members.filter((member) =>
      persons.some((person) => person.person_uid === member.person_uid)
    );

    return record;
  });

  return result;
});
