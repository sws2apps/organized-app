import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { ListByGroupsProps } from './index.types';
import { fieldGroupsState } from '@states/field_service_groups';
import { personsActiveState } from '@states/persons';
import { PersonType } from '@definition/person';
import { formatDate } from '@services/dateformat';
import usePerson from '@features/persons/hooks/usePerson';

const useListByGroups = ({ type }: ListByGroupsProps) => {
  const { t } = useAppTranslation();

  const { personIsPublisher } = usePerson();

  const fieldGroups = useRecoilValue(fieldGroupsState);
  const persons = useRecoilValue(personsActiveState);

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
    const validGroups = fieldGroups.filter(
      (record) => record.group_data.members.length > 0
    );

    const groups_members = validGroups.map((group) => {
      return {
        group_id: group.group_id,
        group_name: group.group_data.name,
        group_members: group.group_data.members.map((record) =>
          publishers.find((person) => person.person_uid === record.person_uid)
        ),
      };
    });

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

  return { groups, month, expanded, handleExpandedChange };
};

export default useListByGroups;
