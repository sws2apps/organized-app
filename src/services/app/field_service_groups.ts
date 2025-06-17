import { FieldServiceGroupMemberType } from '@definition/field_service_groups';
import { personGetFullname } from '@services/states/persons';

export const fieldGroupsSortMembersByName = (
  members: FieldServiceGroupMemberType[]
) => {
  const overseers = members
    .filter((member) => member.isOverseer || member.isAssistant)
    .sort((a, b) => a.sort_index - b.sort_index);

  const group_members = members
    .filter((member) => !member.isOverseer && !member.isAssistant)
    .sort((a, b) => {
      const personA = personGetFullname(a.person_uid);
      const personB = personGetFullname(b.person_uid);

      return personA.localeCompare(personB, undefined, {
        sensitivity: 'base',
      });
    });

  return [...overseers, ...group_members];
};
