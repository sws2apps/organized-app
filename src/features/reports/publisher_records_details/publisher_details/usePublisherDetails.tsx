import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { personsState } from '@states/persons';
import { formatDate } from '@services/dateformat';
import { shortDateFormatState } from '@states/settings';
import { computeYearsDiff } from '@utils/date';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { dbPersonsSave } from '@services/dexie/persons';

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

  const first_report = useMemo(() => {
    if (!person) return null;

    if (person.person_data.first_report?.value) {
      return new Date(person.person_data.first_report.value);
    }

    // get all status history
    let history = [
      ...person.person_data.publisher_unbaptized.history,
      ...person.person_data.publisher_baptized.history,
    ];

    history = history.filter(
      (record) => !record._deleted && record.start_date?.length > 0
    );

    history.sort((a, b) => a.start_date.localeCompare(b.start_date));

    if (history.length === 0) return null;

    return new Date(history.at(0).start_date);
  }, [person]);

  const handleChangeFirstReport = async (value: Date) => {
    try {
      const newPerson = structuredClone(person);

      let finalValue = '';

      if (!value) finalValue = null;

      if (value) {
        const startMonth = formatDate(value, 'yyyy/MM/01');
        finalValue = new Date(startMonth).toISOString();
      }

      newPerson.person_data.first_report = {
        value: finalValue,
        updatedAt: new Date().toISOString(),
      };

      if (finalValue) {
        const baptizedHistory =
          newPerson.person_data.publisher_baptized.history.filter(
            (record) => !record._deleted && record.start_date !== null
          );

        const unbaptizedHistory =
          newPerson.person_data.publisher_unbaptized.history.filter(
            (record) => !record._deleted && record.start_date !== null
          );

        const allHistories = baptizedHistory.concat(unbaptizedHistory);

        if (allHistories.length === 0) {
          const isBaptized =
            newPerson.person_data.publisher_baptized.active.value;

          if (isBaptized) {
            newPerson.person_data.publisher_baptized.history.push({
              id: crypto.randomUUID(),
              _deleted: false,
              updatedAt: new Date().toISOString(),
              start_date: finalValue,
              end_date: null,
            });
          }

          if (!isBaptized) {
            newPerson.person_data.publisher_unbaptized.history.push({
              id: crypto.randomUUID(),
              _deleted: false,
              updatedAt: new Date().toISOString(),
              start_date: finalValue,
              end_date: null,
            });
          }
        }

        if (allHistories.length > 0) {
          const findStartHistory = allHistories
            .sort((a, b) => a.start_date.localeCompare(b.start_date))
            .at(0);

          const findBaptized =
            newPerson.person_data.publisher_baptized.history.find(
              (record) => record.id === findStartHistory.id
            );

          const findUnbaptized =
            newPerson.person_data.publisher_unbaptized.history.find(
              (record) => record.id === findStartHistory.id
            );

          if (findBaptized) {
            findBaptized.start_date = finalValue;
            findBaptized.updatedAt = new Date().toISOString();
          }

          if (findUnbaptized) {
            findUnbaptized.start_date = finalValue;
            findUnbaptized.updatedAt = new Date().toISOString();
          }
        }
      }

      await dbPersonsSave(newPerson);
    } catch (error) {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return {
    person,
    month,
    birth_date_value,
    age,
    baptism_date_value,
    baptism_years,
    first_report,
    handleChangeFirstReport,
  };
};

export default usePublisherDetails;
