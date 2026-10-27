import { atom } from 'jotai';
import { FullnameOption } from '@definition/settings';
import { PersonType } from '@definition/person';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import { TerritoryAssignee } from '@definition/territory';
import { personsActiveState, personsState } from '@states/persons';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { fullnameOptionState, userLocalUIDState } from '@states/settings';
import { personIsPublisher } from '@services/app/persons';
import { getTranslation } from '@services/i18n/translation';
import { buildPersonFullname } from '@utils/common';

// Territories store these names, so they are built the way Organized shows
// a person or a group. The territory app swaps this module for its own.

const personName = (person: PersonType, option: FullnameOption) =>
  buildPersonFullname(
    person.person_data.person_lastname.value,
    person.person_data.person_firstname.value,
    option
  );

const groupName = ({ group_data }: FieldServiceGroupType) =>
  group_data.name ||
  getTranslation({
    key: 'tr_groupNumber',
    params: { groupNumber: group_data.sort_index + 1 },
  });

export const territoryAssigneesState = atom<TerritoryAssignee[]>((get) => {
  const option = get(fullnameOptionState);

  const groups = get(fieldWithLanguageGroupsState).map((group) => ({
    id: group.group_id,
    name: groupName(group),
    group: true,
  }));

  const publishers = get(personsActiveState)
    .filter(
      (person) =>
        !person.person_data.disqualified?.value && personIsPublisher(person)
    )
    .map((person) => ({
      id: person.person_uid,
      name: personName(person, option),
      group: false,
    }));

  return [...groups, ...publishers];
});

// Organized keeps its persons and groups on their own pages, so names can't
// be added from a territory dialog here; the territory app swaps this in
export const addAssignee:
  | ((name: string, group: boolean) => Promise<void>)
  | undefined = undefined;

// the logged-in user's person; empty when the account has none
export const currentPublisherState = atom((get) => {
  const uid = get(userLocalUIDState);
  const person = get(personsState).find((record) => record.person_uid === uid);

  return person ? personName(person, get(fullnameOptionState)) : '';
});
