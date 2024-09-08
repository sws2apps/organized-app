import { useMemo } from 'react';
import { PersonDetailsProps } from './index.types';
import usePerson from '@features/persons/hooks/usePerson';

const usePersonDetails = ({
  month,
  person,
  badgesOverride,
}: PersonDetailsProps) => {
  const { getName, getBadges } = usePerson();

  const name = useMemo(() => {
    if (!person) return '';

    return getName(person);
  }, [person, getName]);

  const female = useMemo(() => {
    if (!person) return false;

    return person.person_data.female.value;
  }, [person]);

  const badges = useMemo(() => {
    if (!person) return [];

    if (badgesOverride) return badgesOverride;

    return getBadges(person, month);
  }, [person, getBadges, month, badgesOverride]);

  return { name, female, badges };
};

export default usePersonDetails;
