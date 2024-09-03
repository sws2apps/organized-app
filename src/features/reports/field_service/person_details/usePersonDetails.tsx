import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { PersonType } from '@definition/person';
import { selectedMonthFieldServiceReportState } from '@states/field_service_reports';
import usePerson from '@features/persons/hooks/usePerson';

const usePersonDetails = (person: PersonType) => {
  const { getName, getBadges } = usePerson();

  const currentMonth = useRecoilValue(selectedMonthFieldServiceReportState);

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

    return getBadges(person, currentMonth);
  }, [person, getBadges, currentMonth]);

  return { name, female, badges };
};

export default usePersonDetails;
