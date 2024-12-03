import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { personCurrentDetailsState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/recoil/persons';
import { PersonType } from '@definition/person';
import { formatDate } from '@services/dateformat';
import { dateFirstDayMonth } from '@utils/date';
import useFirstReport from '../first_report/useFirstReport';

const useUnbaptizedPublisher = () => {
  const { id } = useParams();

  const isAddPerson = id === undefined;

  const { updateFirstReport } = useFirstReport();

  const person = useRecoilValue(personCurrentDetailsState);

  const [isExpanded, setIsExpanded] = useState(false);

  const activeHistory = person.person_data.publisher_unbaptized.history.filter(
    (record) => record._deleted === false
  );

  const isActive = activeHistory.find((record) => record.end_date === null)
    ? true
    : false;

  const handleToggleExpand = () => setIsExpanded((prev) => !prev);

  const handleToggleActive = async () => {
    const newPerson: PersonType = structuredClone(person);

    if (isActive) {
      const activeRecord =
        newPerson.person_data.publisher_unbaptized.history.find(
          (record) => record.end_date === null
        );

      const start_date = formatDate(
        new Date(activeRecord.start_date),
        'yyyy/MM/dd'
      );

      const nowDate = formatDate(new Date(), 'yyyy/MM/dd');

      if (start_date === nowDate) {
        if (isAddPerson) {
          newPerson.person_data.publisher_unbaptized.history =
            newPerson.person_data.publisher_unbaptized.history.filter(
              (record) => record.id !== activeRecord.id
            );
        }

        if (!isAddPerson) {
          activeRecord._deleted = true;
          activeRecord.updatedAt = new Date().toISOString();
        }
      }

      if (start_date !== nowDate) {
        activeRecord.end_date = new Date().toISOString();
        activeRecord.updatedAt = new Date().toISOString();
      }

      updateFirstReport(newPerson);

      await setPersonCurrentDetails(newPerson);
    }

    if (!isActive) {
      await handleAddHistory();
    }
  };

  const handleAddHistory = async () => {
    const newPerson = structuredClone(person);

    newPerson.person_data.publisher_unbaptized.history.push({
      id: crypto.randomUUID(),
      _deleted: false,
      updatedAt: new Date().toISOString(),
      start_date: dateFirstDayMonth().toISOString(),
      end_date: null,
    });

    updateFirstReport(newPerson);

    await setPersonCurrentDetails(newPerson);
  };

  const handleDeleteHistory = async (id: string) => {
    const newPerson = structuredClone(person);

    if (!isAddPerson) {
      const current = newPerson.person_data.publisher_unbaptized.history.find(
        (history) => history.id === id
      );

      current._deleted = true;
      current.updatedAt = new Date().toISOString();
    }

    if (isAddPerson) {
      newPerson.person_data.publisher_unbaptized.history =
        newPerson.person_data.publisher_unbaptized.history.filter(
          (record) => record.id !== id
        );
    }

    updateFirstReport(newPerson);

    await setPersonCurrentDetails(newPerson);
  };

  const handleStartDateChange = async (id: string, value: Date) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.publisher_unbaptized.history.find(
      (history) => history.id === id
    );

    if (value === null) {
      current.start_date = null;
    }

    if (value !== null) {
      const startMonth = dateFirstDayMonth(value).toISOString();
      current.start_date = startMonth;
    }

    updateFirstReport(newPerson);

    await setPersonCurrentDetails(newPerson);
  };

  const handleEndDateChange = async (id: string, value: Date | null) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.publisher_unbaptized.history.find(
      (history) => history.id === id
    );

    current.end_date = value === null ? null : value.toISOString();
    current.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  return {
    handleAddHistory,
    handleDeleteHistory,
    handleStartDateChange,
    handleEndDateChange,
    activeHistory,
    isExpanded,
    handleToggleExpand,
    handleToggleActive,
    isActive,
  };
};

export default useUnbaptizedPublisher;
