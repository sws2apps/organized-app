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

  const activeHistory = person.unbaptizedPublisher.history.filter((record) => record._deleted === null);

  const isActive = activeHistory.find((record) => record.endDate.value === null) ? true : false;

  const handleToggleExpand = () => setIsExpanded((prev) => !prev);

  const handleToggleActive = async () => {
    const newPerson: PersonType = structuredClone(person);

    if (isActive) {
      const activeRecord = newPerson.unbaptizedPublisher.history.find((record) => record.endDate.value === null);

      const startDate = formatDate(new Date(activeRecord.startDate.value), 'mm/dd/yyyy');
      const nowDate = formatDate(new Date(), 'mm/dd/yyyy');

      if (startDate === nowDate) {
        if (isAddPerson) {
          newPerson.unbaptizedPublisher.history = newPerson.unbaptizedPublisher.history.filter(
            (record) => record.id !== activeRecord.id
          );
        }

        if (!isAddPerson) {
          activeRecord._deleted = new Date().toISOString();
        }
      }

      if (startDate !== nowDate) {
        activeRecord.endDate.value = new Date().toISOString();
        activeRecord.endDate.updatedAt = new Date().toISOString();
      }

      await setPersonCurrentDetails(newPerson);
    }

    if (!isActive) {
      await handleAddHistory();
    }
  };

  const handleFirstReportChange = async (value: Date | null) => {
    const newPerson = structuredClone(person);

    newPerson.firstMonthReport = {
      value: value === null ? null : value.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setPersonCurrentDetails(newPerson);
  };

  const handleAddHistory = async () => {
    const newPerson = structuredClone(person);

    newPerson.unbaptizedPublisher.history.push({
      id: crypto.randomUUID(),
      startDate: { value: dateFirstDayMonth().toISOString(), updatedAt: new Date().toISOString() },
      endDate: { value: null, updatedAt: new Date().toISOString() },
      _deleted: null,
    });

    await setPersonCurrentDetails(newPerson);
  };

  const handleDeleteHistory = async (id: string) => {
    const newPerson = structuredClone(person);

    if (!isAddPerson) {
      const current = newPerson.unbaptizedPublisher.history.find((history) => history.id === id);
      current._deleted = new Date().toISOString();
    }

    if (isAddPerson) {
      newPerson.unbaptizedPublisher.history = newPerson.unbaptizedPublisher.history.filter(
        (record) => record.id !== id
      );
    }

    await setPersonCurrentDetails(newPerson);
  };

  const handleStartDateChange = async (id: string, value: Date) => {
    const newPerson = structuredClone(person);

    const current = newPerson.unbaptizedPublisher.history.find((history) => history.id === id);
    current.startDate = {
      value: value.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setPersonCurrentDetails(newPerson);
  };

  const handleEndDateChange = async (id: string, value: Date | null) => {
    const newPerson = structuredClone(person);

    const current = newPerson.unbaptizedPublisher.history.find((history) => history.id === id);
    current.endDate = {
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
