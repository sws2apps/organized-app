/*
This file holds the source of the truth from the table "fieldServiceGroup".
*/

import { atom } from 'jotai';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import { personsActiveState } from './persons';
import { isElderState, languageGroupsState } from './settings';
import { personIsPublisher } from '@services/app/persons';

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

export const fieldWithLanguageGroupsState = atom((get) => {
  const isElder = get(isElderState);

  const groups = get(fieldGroupsState);
  const languageGroups = get(languageGroupsState);
  const persons = get(personsActiveState);

  const varGroups: FieldServiceGroupType[] = languageGroups.map(
    (group, index) => {
      const personsMembers = persons
        .filter(
          (record) =>
            record.person_data.categories.value.includes(group.id) &&
            personIsPublisher(record)
        )
        .map((record) => record.person_uid);

      const groupMembers = Array.from(
        new Set([...group.overseers, ...personsMembers])
      ).map((record, index) => {
        const isAdmin = group.overseers.includes(record);

        return {
          person_uid: record,
          isOverseer: false,
          isAssistant: isAdmin,
          sort_index: (isAdmin ? 1 : 2) + index,
        };
      });

      const firstAssistant = groupMembers.find((member) => member.isAssistant);

      if (firstAssistant) {
        firstAssistant.isOverseer = true;
        firstAssistant.isAssistant = false;
      }

      return {
        group_id: group.id,
        group_data: {
          _deleted: false,
          updatedAt: group.updatedAt,
          name: group.name,
          sort_index: groups.length + 1 + index,
          members: groupMembers,
        },
      };
    }
  );

  const combinedData = groups
    .map((group) => {
      return {
        editable: true,
        group,
      };
    })
    .concat(
      varGroups.map((record) => {
        return {
          editable: false,
          group: record,
        };
      })
    );

  const result = combinedData.map((record) => {
    record.group.group_data.members = record.group.group_data.members.filter(
      (member) => {
        if (isElder) return true;

        const person = persons.find(
          (person) => person.person_uid === member.person_uid
        );

        if (!person) return false;

        return personIsPublisher(person);
      }
    );

    return record;
  });

  return result;
});
