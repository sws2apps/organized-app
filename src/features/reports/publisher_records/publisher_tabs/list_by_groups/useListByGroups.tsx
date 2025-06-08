import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { PersonType } from '@definition/person';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { personsActiveState } from '@states/persons';
import { formatDate } from '@utils/date';
import { fieldGroupsSortMembersByName } from '@services/app/field_service_groups';
import { GroupOption, ListByGroupsProps } from './index.types';
import usePerson from '@features/persons/hooks/usePerson';

const useListByGroups = ({ type }: ListByGroupsProps) => {
  const { t } = useAppTranslation();

  const { personIsPublisher } = usePerson();

  const fieldGroups = useAtomValue(fieldWithLanguageGroupsState);
  const persons = useAtomValue(personsActiveState);

  const [expanded, setExpanded] = useState<string | false>(false);

  const month = useMemo(() => {
    return formatDate(new Date(), 'yyyy/MM');
  }, []);

  const publishers = useMemo(() => {
    const result: PersonType[] = [];

    const current = persons.filter(
      (person) =>
        person.person_data.publisher_baptized.active.value ||
        person.person_data.publisher_unbaptized.active.value
    );

    for (const person of current) {
      const isPublisher = personIsPublisher(person);

      if (type === 'active' && isPublisher) {
        result.push(person);
      }

      if (type === 'inactive' && !isPublisher) {
        result.push(person);
      }
    }

    return result;
  }, [persons, type, personIsPublisher]);

  const groups = useMemo(() => {
    if (publishers.length === 0) return [];

    const validGroups = fieldGroups.filter(
      (record) => record.group_data.members.length > 0
    );

    const groups_members: GroupOption[] = [];

    for (const group of validGroups) {
      // sort members by name
      const valid_members = fieldGroupsSortMembersByName(
        group.group_data.members
      ).filter((record) => {
        const valid = publishers.some(
          (person) => person.person_uid === record.person_uid
        );
        return valid;
      });

      if (valid_members.length === 0) continue;

      let group_name = group.group_data.name ?? '';

      if (group_name.length === 0) {
        group_name = t('tr_groupName', {
          groupName: String(group.group_data.sort_index + 1),
        });
      }

      groups_members.push({
        group_id: group.group_id,
        group_name,
        group_members: valid_members.map((record) =>
          publishers.find((person) => person.person_uid === record.person_uid)
        ),
      });
    }

    const unassigned_members = publishers.filter(
      (person) =>
        groups_members.some((group) =>
          group.group_members.some(
            (member) => member.person_uid === person.person_uid
          )
        ) === false
    );

    if (unassigned_members.length > 0) {
      groups_members.push({
        group_id: 'group_unassigned',
        group_name: t('tr_groupNotAssigned'),
        group_members: unassigned_members,
      });
    }

    return groups_members;
  }, [fieldGroups, publishers, t]);

  const handleExpandedChange = (value: string | false) => setExpanded(value);

  return { groups, month, expanded, handleExpandedChange, type };
};

export default useListByGroups;
