import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { UnassignedPublisherType } from './index.types';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { fullnameOptionState } from '@states/settings';
import { personsActiveState } from '@states/persons';
import { buildPersonFullname } from '@utils/common';

const useUnassignedPublishers = () => {
  const persons = useAtomValue(personsActiveState);
  const groups = useAtomValue(fieldWithLanguageGroupsState);
  const fullnameOption = useAtomValue(fullnameOptionState);

  const publishers = useMemo(() => {
    const assigned = groups.flatMap((group) =>
      group.group_data.members.map((member) => member.person_uid)
    );

    const result: UnassignedPublisherType[] = persons
      .filter(
        (person) =>
          (person.person_data.publisher_baptized.active.value ||
            person.person_data.publisher_unbaptized.active.value) &&
          !assigned.includes(person.person_uid)
      )
      .map((person) => ({
        person_uid: person.person_uid,
        name: buildPersonFullname(
          person.person_data.person_lastname.value,
          person.person_data.person_firstname.value,
          fullnameOption
        ),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [persons, groups, fullnameOption]);

  return { publishers };
};

export default useUnassignedPublishers;
