/*
This file holds the source of the truth from the table "fieldServiceGroup".
*/

import { atom, selector } from 'recoil';
import { FieldServiceGroupType } from '@definition/field_service_groups';

export const fieldServiceGroupsState = atom<FieldServiceGroupType[]>({
  key: 'fieldServiceGroups',
  default: [],
});

export const fieldGroupsState = selector({
  key: 'fieldGroupsState',
  get: ({ get }) => {
    const groups = get(fieldServiceGroupsState);

    return groups
      .filter((record) => !record.group_data._deleted)
      .sort((a, b) => a.group_data.sort_index - b.group_data.sort_index);
  },
});
