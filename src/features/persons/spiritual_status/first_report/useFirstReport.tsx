import { useRecoilState } from 'recoil';
import { personCurrentDetailsState } from '@states/persons';
import { useMemo } from 'react';
import { formatDate } from '@services/dateformat';

const useFirstReport = () => {
  const [person, setPerson] = useRecoilState(personCurrentDetailsState);

  const value = useMemo(() => {
    return person.person_data.first_report?.value
      ? new Date(person.person_data.first_report.value)
      : null;
  }, [person]);

  const handleChangeFirstReport = async (value: Date) => {
    const newPerson = structuredClone(person);

    let finalValue = '';

    if (!value) finalValue = value as null;

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

    setPerson(newPerson);
  };

  return { handleChangeFirstReport, value };
};

export default useFirstReport;