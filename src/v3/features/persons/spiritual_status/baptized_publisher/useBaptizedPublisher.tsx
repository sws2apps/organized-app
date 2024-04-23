import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { personCurrentDetailsState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/recoil/persons';
import { computeYearsDiff, dateFirstDayMonth } from '@utils/date';
import { formatDate } from '@services/dateformat';
import { PersonType } from '@definition/person';

const useBaptizedPublisher = () => {
  const { id } = useParams();
  const isAddPerson = id === undefined;

  const person = useRecoilValue(personCurrentDetailsState);

  const [age, setAge] = useState('0');
  const [isExpanded, setIsExpanded] = useState(false);

  const activeHistory = person.baptizedPublisher.history.filter((record) => record._deleted === null);

  const isActive = activeHistory.find((record) => record.endDate.value === null) ? true : false;

  const handleToggleExpand = () => setIsExpanded((prev) => !prev);

  const handleToggleActive = async () => {
    const newPerson: PersonType = structuredClone(person);

    if (isActive) {
      const activeRecord = newPerson.baptizedPublisher.history.find((record) => record.endDate.value === null);

      const startDate = formatDate(new Date(activeRecord.startDate.value), 'mm/dd/yyyy');
      const nowDate = formatDate(new Date(), 'mm/dd/yyyy');

      if (startDate === nowDate) {
        if (isAddPerson) {
          newPerson.baptizedPublisher.history = newPerson.baptizedPublisher.history.filter(
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

    newPerson.baptizedPublisher.history.push({
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
      const current = newPerson.baptizedPublisher.history.find((history) => history.id === id);
      current._deleted = new Date().toISOString();
    }

    if (isAddPerson) {
      newPerson.baptizedPublisher.history = newPerson.baptizedPublisher.history.filter((record) => record.id !== id);
    }

    await setPersonCurrentDetails(newPerson);
  };

  const handleStartDateChange = async (id: string, value: Date) => {
    const newPerson = structuredClone(person);

    const current = newPerson.baptizedPublisher.history.find((history) => history.id === id);
    current.startDate = {
      value: value.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setPersonCurrentDetails(newPerson);
  };

  const handleEndDateChange = async (id: string, value: Date | null) => {
    const newPerson = structuredClone(person);

    const current = newPerson.baptizedPublisher.history.find((history) => history.id === id);
    current.endDate = {
      value: value === null ? null : value.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setPersonCurrentDetails(newPerson);
  };

  const handleToggleHope = async (value) => {
    const newPerson = structuredClone(person);

    if (value === 'anointed') {
      newPerson.baptizedPublisher.isAnointed.value = true;
      newPerson.baptizedPublisher.isAnointed.updatedAt = new Date().toISOString();

      newPerson.baptizedPublisher.isOtherSheep.value = false;
      newPerson.baptizedPublisher.isOtherSheep.updatedAt = new Date().toISOString();
    }

    if (value === 'otherSheep') {
      newPerson.baptizedPublisher.isAnointed.value = false;
      newPerson.baptizedPublisher.isAnointed.updatedAt = new Date().toISOString();

      newPerson.baptizedPublisher.isOtherSheep.value = true;
      newPerson.baptizedPublisher.isOtherSheep.updatedAt = new Date().toISOString();
    }

    await setPersonCurrentDetails(newPerson);
  };

  const handleChangeBaptismDate = async (value: Date) => {
    const newPerson = structuredClone(person);

    newPerson.baptizedPublisher.baptismDate.value = value === null ? null : new Date(value).toISOString();
    newPerson.baptizedPublisher.baptismDate.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  useEffect(() => {
    if (person.baptizedPublisher.baptismDate.value === null) {
      setAge('0');
    }

    if (person.baptizedPublisher.baptismDate.value !== null) {
      const age = computeYearsDiff(person.baptizedPublisher.baptismDate.value);
      setAge(age);
    }
  }, [person.baptizedPublisher.baptismDate.value]);

  return {
    age,
    person,
    handleAddHistory,
    handleDeleteHistory,
    handleStartDateChange,
    handleEndDateChange,
    handleFirstReportChange,
    handleToggleHope,
    handleChangeBaptismDate,
    activeHistory,
    handleToggleExpand,
    isExpanded,
    isActive,
    handleToggleActive,
  };
};

export default useBaptizedPublisher;
