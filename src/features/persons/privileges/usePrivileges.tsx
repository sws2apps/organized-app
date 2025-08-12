import { useMemo } from 'react';
import { useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import { personCurrentDetailsState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/states/persons';
import { PrivilegeType } from '@definition/person';
import { formatDate } from '@utils/date';

const usePrivileges = () => {
  const { id } = useParams();

  const isAddPerson = id === undefined;

  const person = useAtomValue(personCurrentDetailsState);

  const activeHistory = useMemo(() => {
    return person.person_data.privileges
      .filter((record) => record._deleted === false)
      .sort((a, b) => a.start_date.localeCompare(b.start_date));
  }, [person]);

  const handleAddHistory = async () => {
    const newPerson = structuredClone(person);

    newPerson.person_data.privileges.push({
      id: crypto.randomUUID(),
      _deleted: false,
      updatedAt: new Date().toISOString(),
      privilege: 'ms',
      start_date: formatDate(new Date(), 'yyyy/MM/dd'),
      end_date: null,
    });

    setPersonCurrentDetails(newPerson);
  };

  const handleDeleteHistory = async (id: string) => {
    const newPerson = structuredClone(person);

    if (!isAddPerson) {
      const current = newPerson.person_data.privileges.find(
        (history) => history.id === id
      );

      current._deleted = true;
      current.updatedAt = new Date().toISOString();
    }

    if (isAddPerson) {
      newPerson.person_data.privileges =
        newPerson.person_data.privileges.filter((record) => record.id !== id);
    }

    setPersonCurrentDetails(newPerson);
  };

  const handleStartDateChange = async (id: string, value: Date) => {
    if (value === null) return;

    const newPerson = structuredClone(person);

    const current = newPerson.person_data.privileges.find(
      (history) => history.id === id
    );

    current.start_date = formatDate(value, 'yyyy/MM/dd');
    current.updatedAt = new Date().toISOString();

    setPersonCurrentDetails(newPerson);
  };

  const handleEndDateChange = async (id: string, value: Date | null) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.privileges.find(
      (history) => history.id === id
    );

    current.end_date = value === null ? null : formatDate(value, 'yyyy/MM/dd');
    current.updatedAt = new Date().toISOString();

    setPersonCurrentDetails(newPerson);
  };

  const handlePrivilegeChange = async (id: string, value: string) => {
    const newPerson = structuredClone(person);

    const newValue = value as PrivilegeType;

    const current = newPerson.person_data.privileges.find(
      (history) => history.id === id
    );

    current.privilege = newValue;
    current.updatedAt = new Date().toISOString();

    setPersonCurrentDetails(newPerson);
  };

  return {
    activeHistory,
    handleAddHistory,
    handleDeleteHistory,
    handleStartDateChange,
    handleEndDateChange,
    handlePrivilegeChange,
  };
};

export default usePrivileges;
