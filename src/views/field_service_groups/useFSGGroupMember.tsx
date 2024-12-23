import { FSGGroupMemberType } from './index.types';
import { useMemo } from 'react';
import { buildPersonFullname } from '@utils/common';

const useFSGGroupMember = ({
  data,
  persons,
  fullnameOption,
}: FSGGroupMemberType) => {
  const person = useMemo(() => {
    return persons.find((record) => record.person_uid === data.person_uid);
  }, [persons, data]);

  const member_name = useMemo(() => {
    if (!person) return '';

    return buildPersonFullname(
      person.person_data.person_lastname.value,
      person.person_data.person_firstname.value,
      fullnameOption
    );
  }, [person, fullnameOption]);

  return {
    member_name,
  };
};

export default useFSGGroupMember;
