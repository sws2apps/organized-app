import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { personCurrentDetailsState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/recoil/persons';
import { computeYearsDiff } from '@utils/date';

const useBaptizedPublisher = () => {
  const person = useRecoilValue(personCurrentDetailsState);

  const [age, setAge] = useState('0');

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
      startDate: { value: new Date().toISOString(), updatedAt: new Date().toISOString() },
      endDate: { value: null, updatedAt: new Date().toISOString() },
    });

    await setPersonCurrentDetails(newPerson);
  };

  const handleDeleteHistory = async (id: string) => {
    const newPerson = structuredClone(person);

    newPerson.baptizedPublisher.history = newPerson.baptizedPublisher.history.filter((history) => history.id !== id);

    newPerson.baptizedPublisher._deleted = newPerson.baptizedPublisher._deleted.filter((history) => history.id !== id);
    newPerson.baptizedPublisher._deleted.push({ id, on: new Date().toISOString() });

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
  };
};

export default useBaptizedPublisher;
