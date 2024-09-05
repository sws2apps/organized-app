import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { personCurrentDetailsState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/recoil/persons';
import { PrivilegeType } from '@definition/person';

const usePrivileges = () => {
  const { id } = useParams();
  const isAddPerson = id === undefined;

  const person = useRecoilValue(personCurrentDetailsState);

  const activeHistory = person.person_data.privileges.filter(
    (record) => record._deleted === false
  );

  const handleAddHistory = async () => {
    const newPerson = structuredClone(person);

    newPerson.person_data.privileges.push({
      id: crypto.randomUUID(),
      _deleted: false,
      updatedAt: new Date().toISOString(),
      privilege: 'ms',
      start_date: new Date().toISOString(),
      end_date: null,
    });

    await setPersonCurrentDetails(newPerson);
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

    await setPersonCurrentDetails(newPerson);
  };

  const handleStartDateChange = async (id: string, value: Date) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.privileges.find(
      (history) => history.id === id
    );

    current.start_date = value.toISOString();
    current.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  const handleEndDateChange = async (id: string, value: Date | null) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.privileges.find(
      (history) => history.id === id
    );

    current.end_date = value === null ? null : value.toISOString();
    current.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  const handlePrivilegeChange = async (id: string, value: string) => {
    const newPerson = structuredClone(person);

    const newValue = value as PrivilegeType;

    const current = newPerson.person_data.privileges.find(
      (history) => history.id === id
    );

    current.privilege = newValue;
    current.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
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
