import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { personCurrentDetailsState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/recoil/persons';
import { PersonType } from '@definition/person';
import { formatDate } from '@services/dateformat';
import { dateFirstDayMonth } from '@utils/date';

const useUnbaptizedPublisher = () => {
  const { id } = useParams();
  const isAddPerson = id === undefined;

  const person = useRecoilValue(personCurrentDetailsState);

  const [isExpanded, setIsExpanded] = useState(false);

  const activeHistory = person.publisher_unbaptized.history.filter((record) => record._deleted === null);

  const isActive = activeHistory.find((record) => record.end_date.value === null) ? true : false;

  const handleToggleExpand = () => setIsExpanded((prev) => !prev);

  const handleToggleActive = async () => {
    const newPerson: PersonType = structuredClone(person);

    if (isActive) {
      const activeRecord = newPerson.publisher_unbaptized.history.find((record) => record.end_date.value === null);

      const start_date = formatDate(new Date(activeRecord.start_date.value), 'MM/dd/yyyy');
      const nowDate = formatDate(new Date(), 'MM/dd/yyyy');

      if (start_date === nowDate) {
        if (isAddPerson) {
          newPerson.publisher_unbaptized.history = newPerson.publisher_unbaptized.history.filter(
            (record) => record.id !== activeRecord.id
          );
        }

        if (!isAddPerson) {
          activeRecord._deleted = new Date().toISOString();
        }
      }

      if (start_date !== nowDate) {
        activeRecord.end_date.value = new Date().toISOString();
        activeRecord.end_date.updatedAt = new Date().toISOString();
      }

      await setPersonCurrentDetails(newPerson);
    }

    if (!isActive) {
      await handleAddHistory();
    }
  };

  const handleFirstReportChange = async (value: Date | null) => {
    const newPerson = structuredClone(person);

    newPerson.first_month_report = {
      value: value === null ? null : value.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setPersonCurrentDetails(newPerson);
  };

  const handleAddHistory = async () => {
    const newPerson = structuredClone(person);

    newPerson.publisher_unbaptized.history.push({
      id: crypto.randomUUID(),
      start_date: { value: dateFirstDayMonth().toISOString(), updatedAt: new Date().toISOString() },
      end_date: { value: null, updatedAt: new Date().toISOString() },
      _deleted: null,
    });

    await setPersonCurrentDetails(newPerson);
  };

  const handleDeleteHistory = async (id: string) => {
    const newPerson = structuredClone(person);

    if (!isAddPerson) {
      const current = newPerson.publisher_unbaptized.history.find((history) => history.id === id);
      current._deleted = new Date().toISOString();
    }

    if (isAddPerson) {
      newPerson.publisher_unbaptized.history = newPerson.publisher_unbaptized.history.filter(
        (record) => record.id !== id
      );
    }

    await setPersonCurrentDetails(newPerson);
  };

  const handleStartDateChange = async (id: string, value: Date) => {
    const newPerson = structuredClone(person);

    const current = newPerson.publisher_unbaptized.history.find((history) => history.id === id);
    current.start_date = {
      value: value.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setPersonCurrentDetails(newPerson);
  };

  const handleEndDateChange = async (id: string, value: Date | null) => {
    const newPerson = structuredClone(person);

    const current = newPerson.publisher_unbaptized.history.find((history) => history.id === id);
    current.end_date = {
      value: value === null ? null : value.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setPersonCurrentDetails(newPerson);
  };

  return {
    person,
    handleAddHistory,
    handleDeleteHistory,
    handleStartDateChange,
    handleEndDateChange,
    handleFirstReportChange,
    activeHistory,
    isExpanded,
    handleToggleExpand,
    handleToggleActive,
    isActive,
  };
};

export default useUnbaptizedPublisher;
