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

  const activeHistory = person.person_data.publisher_baptized.history.filter(
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
        newPerson.person_data.publisher_baptized.history.find(
          (record) => record.end_date === null
        );

      const start_date = formatDate(
        new Date(activeRecord.start_date),
        'yyyy/MM/dd'
      );
      const nowDate = formatDate(new Date(), 'yyyy/MM/dd');

      if (start_date === nowDate) {
        if (isAddPerson) {
          newPerson.person_data.publisher_baptized.history =
            newPerson.person_data.publisher_baptized.history.filter(
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

      await setPersonCurrentDetails(newPerson);
    }

    if (!isActive) {
      await handleAddHistory();
    }
  };

  const handleAddHistory = async () => {
    const newPerson = structuredClone(person);

    newPerson.person_data.publisher_baptized.history.push({
      id: crypto.randomUUID(),
      _deleted: false,
      updatedAt: new Date().toISOString(),
      start_date: dateFirstDayMonth().toISOString(),
      end_date: null,
    });

    await setPersonCurrentDetails(newPerson);
  };

  const handleDeleteHistory = async (id: string) => {
    const newPerson = structuredClone(person);

    if (!isAddPerson) {
      const current = newPerson.person_data.publisher_baptized.history.find(
        (history) => history.id === id
      );

      current._deleted = true;
      current.updatedAt = new Date().toISOString();
    }

    if (isAddPerson) {
      newPerson.person_data.publisher_baptized.history =
        newPerson.person_data.publisher_baptized.history.filter(
          (record) => record.id !== id
        );
    }

    await setPersonCurrentDetails(newPerson);
  };

  const handleStartDateChange = async (id: string, value: Date) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.publisher_baptized.history.find(
      (history) => history.id === id
    );

    current.start_date = value.toISOString();
    current.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  const handleEndDateChange = async (id: string, value: Date | null) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.publisher_baptized.history.find(
      (history) => history.id === id
    );

    current.end_date = value === null ? null : value.toISOString();
    current.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  const handleToggleHope = async (value) => {
    const newPerson = structuredClone(person);

    if (value === 'anointed') {
      newPerson.person_data.publisher_baptized.anointed.value = true;
      newPerson.person_data.publisher_baptized.anointed.updatedAt =
        new Date().toISOString();

      newPerson.person_data.publisher_baptized.other_sheep.value = false;
      newPerson.person_data.publisher_baptized.other_sheep.updatedAt =
        new Date().toISOString();
    }

    if (value === 'otherSheep') {
      newPerson.person_data.publisher_baptized.anointed.value = false;
      newPerson.person_data.publisher_baptized.anointed.updatedAt =
        new Date().toISOString();

      newPerson.person_data.publisher_baptized.other_sheep.value = true;
      newPerson.person_data.publisher_baptized.other_sheep.updatedAt =
        new Date().toISOString();
    }

    await setPersonCurrentDetails(newPerson);
  };

  const handleChangeBaptismDate = async (value: Date) => {
    const newPerson = structuredClone(person);

    newPerson.person_data.publisher_baptized.baptism_date.value =
      value === null ? null : new Date(value).toISOString();
    newPerson.person_data.publisher_baptized.baptism_date.updatedAt =
      new Date().toISOString();

    const histories = newPerson.person_data.publisher_baptized.history.filter(
      (record) => !record._deleted && record.start_date !== null
    );

    if (histories.length === 0 && value) {
      const startMonth = new Date(
        formatDate(value, 'yyyy/MM/01')
      ).toISOString();

      newPerson.person_data.publisher_baptized.history.push({
        _deleted: false,
        end_date: null,
        id: crypto.randomUUID(),
        start_date: startMonth,
        updatedAt: new Date().toISOString(),
      });
    }

    await setPersonCurrentDetails(newPerson);
  };

  useEffect(() => {
    if (person.person_data.publisher_baptized.baptism_date.value === null) {
      setAge('0');
    }

    if (person.person_data.publisher_baptized.baptism_date.value !== null) {
      const age = computeYearsDiff(
        person.person_data.publisher_baptized.baptism_date.value
      );
      setAge(age);
    }
  }, [person.person_data.publisher_baptized.baptism_date.value]);

  return {
    age,
    person,
    handleAddHistory,
    handleDeleteHistory,
    handleStartDateChange,
    handleEndDateChange,
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
