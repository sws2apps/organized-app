import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { RemovePersonProps } from './index.types';
import { personsState } from '@states/persons';
import { fullnameOptionState } from '@states/settings';
import { buildPersonFullname } from '@utils/common';
import { fieldGroupsState } from '@states/field_service_groups';

const useRemovePerson = ({ group_id, index, member }: RemovePersonProps) => {
  const persons = useAtomValue(personsState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const groups = useAtomValue(fieldGroupsState);

  const group = useMemo(() => {
    return groups.find((record) => record.group_id === group_id);
  }, [groups, group_id]);

  const person = useMemo(() => {
    return persons.find((record) => record.person_uid === member.person_uid);
  }, [member, persons]);

  const person_name = useMemo(() => {
    if (!person) return '';

    const name = buildPersonFullname(
      person.person_data.person_lastname.value,
      person.person_data.person_firstname.value,
      fullnameOption
    );

    return name;
  }, [person, fullnameOption]);

  const group_name = useMemo(() => {
    let fullname = index.toString();

    const name = group.group_data.name;

    if (name.length > 0) {
      fullname += ` — ${name}`;
    }

    return fullname;
  }, [index, group]);

  return { person_name, group_name };
};

export default useRemovePerson;
