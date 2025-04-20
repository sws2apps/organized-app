import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { personsState } from '@states/persons';
import { MemberItemProps } from './index.types';
import { buildPersonFullname } from '@utils/common';
import { fullnameOptionState } from '@states/settings';

const useMemberItem = ({ member, onDelete }: MemberItemProps) => {
  const persons = useAtomValue(personsState);
  const fullnameOption = useAtomValue(fullnameOptionState);

  const name = useMemo(() => {
    if (!member) return '';

    const person = persons.find((record) => record.person_uid === member);

    return buildPersonFullname(
      person.person_data.person_lastname.value,
      person.person_data.person_firstname.value,
      fullnameOption
    );
  }, [member, persons, fullnameOption]);

  const handleRemove = () => {
    onDelete?.(member);
  };

  return { name, handleRemove };
};

export default useMemberItem;
