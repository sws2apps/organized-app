import { useCallback, useMemo } from 'react';
import { GroupItemProps } from './index.types';
import { useRecoilValue } from 'recoil';
import { fullnameOptionState, publishersSortState } from '@states/settings';
import { personsState } from '@states/persons';
import { buildPersonFullname } from '@utils/common';
import { PublishersSortOption } from '@definition/settings';

const useGroupItem = ({ group, index }: GroupItemProps) => {
  const persons = useRecoilValue(personsState);
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const sortMethod = useRecoilValue(publishersSortState);

  const getPersonNameByUid = useCallback(
    (uid: string): string => {
      const person = persons.find((record) => record.person_uid === uid);

      if (!person) return '';

      return buildPersonFullname(
        person.person_data.person_lastname.value,
        person.person_data.person_firstname.value,
        fullnameOption
      );
    },
    [persons, fullnameOption]
  );

  const border_color = useMemo(() => {
    const css = `--group-${index}-base`;

    return `1px solid rgba(var(${css}), 0.48)`;
  }, [index]);

  const divider_color = useMemo(() => {
    const css = `--group-${index}-base`;

    return `rgba(var(${css}), 0.16)`;
  }, [index]);

  const members = useMemo(() => {
    switch (sortMethod) {
      case PublishersSortOption.MANUAL:
        return group.group_data.members.toSorted(
          (a, b) => a.sort_index - b.sort_index
        );

      case PublishersSortOption.ALPHABETICAL:
        return group.group_data.members.toSorted((a, b) => {
          const nameA = getPersonNameByUid(a.person_uid).toLowerCase();
          const nameB = getPersonNameByUid(b.person_uid).toLowerCase();
          return nameA.localeCompare(nameB);
        });

      default:
        return group.group_data.members;
    }
  }, [getPersonNameByUid, group.group_data.members, sortMethod]);

  return {
    border_color,
    divider_color,
    members,
  };
};

export default useGroupItem;
