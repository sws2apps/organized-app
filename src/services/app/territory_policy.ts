import { store } from '@states/index';
import { personsState } from '@states/persons';
import { fieldServiceGroupsState } from '@states/field_service_groups';
import {
  congRoleState,
  territoryAccessState,
  territoryRestrictedCategoriesState,
  territoryRestrictedTypesState,
} from '@states/settings';
import { personIsPublisher } from '@services/app/persons';
import type { TerritoryGrant } from '@definition/territory_sync';

export const isTerritorySyncManager = () =>
  store
    .get(congRoleState)
    .some((role) =>
      [
        'admin',
        'coordinator',
        'secretary',
        'service_overseer',
        'elder',
      ].includes(role)
    );
export const buildTerritoryGrants = (): TerritoryGrant[] => {
  const groups = store
    .get(fieldServiceGroupsState)
    .filter((item) => !item.group_data._deleted);
  return store
    .get(personsState)
    .map((person) => ({
      personId: person.person_uid,
      eligible:
        !person._deleted.value &&
        !person.person_data.archived?.value &&
        !person.person_data.disqualified?.value &&
        personIsPublisher(person),
      access: store.get(territoryAccessState),
      dataViews: [
        ...new Set(person.person_data.assignments.map((item) => item.type)),
      ],
      groupIds: groups
        .filter((group) =>
          group.group_data.members.some(
            (member) =>
              member.person_uid === person.person_uid &&
              (member.isOverseer || member.isAssistant)
          )
        )
        .map((group) => group.group_id),
      restrictedCategories: store.get(territoryRestrictedCategoriesState),
      restrictedTypes: store.get(territoryRestrictedTypesState),
    }))
    .sort((a, b) => a.personId.localeCompare(b.personId));
};
