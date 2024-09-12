import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { PersonItemProps } from './index.types';
import { buildPersonFullname } from '@utils/common';
import { fullnameOptionState } from '@states/settings';

const usePersonItem = ({ person }: PersonItemProps) => {
  const fullnameOption = useRecoilValue(fullnameOptionState);

  const name = useMemo(() => {
    if (!person) return '';

    return buildPersonFullname(
      person.person_data.person_lastname.value,
      person.person_data.person_firstname.value,
      fullnameOption
    );
  }, [person, fullnameOption]);

  return { name };
};

export default usePersonItem;
