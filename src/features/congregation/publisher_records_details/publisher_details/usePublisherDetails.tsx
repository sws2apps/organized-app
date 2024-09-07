import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { personsState } from '@states/persons';
import { formatDate } from '@services/dateformat';
import { shortDateFormatState } from '@states/settings';
import { computeYearsDiff } from '@utils/date';

const usePublisherDetails = () => {
  const { id } = useParams();

  const persons = useRecoilValue(personsState);
  const dateFormat = useRecoilValue(shortDateFormatState);

  const month = useMemo(() => {
    return formatDate(new Date(), 'yyyy/MM');
  }, []);

  const person = useMemo(() => {
    return persons.find((record) => record.person_uid === id);
  }, [id, persons]);

  const birth_date = useMemo(() => {
    if (!person) return '';

    const date = person.person_data.birth_date.value;

    if (!date || date.length === 0) return '';

    return date;
  }, [person]);

  const birth_date_value = useMemo(() => {
    if (birth_date.length === 0) return '';

    return formatDate(new Date(birth_date), dateFormat);
  }, [birth_date, dateFormat]);

  const age = useMemo(() => {
    if (birth_date.length === 0) return '';

    const count = computeYearsDiff(birth_date);
    return count;
  }, [birth_date]);

  const baptism_date = useMemo(() => {
    if (!person) return '';

    const date = person.person_data.publisher_baptized.baptism_date.value;

    if (!date || date.length === 0) return '';

    return date;
  }, [person]);

  const baptism_date_value = useMemo(() => {
    if (baptism_date.length === 0) return '';

    return formatDate(new Date(baptism_date), dateFormat);
  }, [baptism_date, dateFormat]);

  const baptism_years = useMemo(() => {
    if (baptism_date.length === 0) return '';

    const count = computeYearsDiff(baptism_date);
    return count;
  }, [baptism_date]);

  return {
    person,
    month,
    birth_date_value,
    age,
    baptism_date_value,
    baptism_years,
  };
};

export default usePublisherDetails;
