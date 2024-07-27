import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { personCurrentDetailsState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/recoil/persons';
import { EnrollmentType } from '@definition/person';

const useEnrollments = () => {
  const { id } = useParams();
  const isAddPerson = id === undefined;

  const person = useRecoilValue(personCurrentDetailsState);

  const activeHistory = person.person_data.enrollments.filter(
    (record) => record._deleted.value === false
  );

  const handleAddHistory = async () => {
    const newPerson = structuredClone(person);

    newPerson.person_data.enrollments.push({
      id: crypto.randomUUID(),
      enrollment: { value: 'AP', updatedAt: new Date().toISOString() },
      start_date: {
        value: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      end_date: { value: null, updatedAt: new Date().toISOString() },
      _deleted: { value: false, updatedAt: '' },
    });

    await setPersonCurrentDetails(newPerson);
  };

  const handleDeleteHistory = async (id: string) => {
    const newPerson = structuredClone(person);

    if (!isAddPerson) {
      const current = newPerson.person_data.enrollments.find(
        (history) => history.id === id
      );
      current._deleted = { value: true, updatedAt: new Date().toISOString() };
    }

    if (isAddPerson) {
      newPerson.person_data.enrollments =
        newPerson.person_data.enrollments.filter((record) => record.id !== id);
    }

    await setPersonCurrentDetails(newPerson);
  };

  const handleStartDateChange = async (id: string, value: Date) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.enrollments.find(
      (history) => history.id === id
    );
    current.start_date = {
      value: value.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setPersonCurrentDetails(newPerson);
  };

  const handleEndDateChange = async (id: string, value: Date | null) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.enrollments.find(
      (history) => history.id === id
    );
    current.end_date = {
      value: value === null ? null : value.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setPersonCurrentDetails(newPerson);
  };

  const handleEnrollmentChange = async (id: string, value: string) => {
    const newPerson = structuredClone(person);

    const newValue = value as EnrollmentType;

    const current = newPerson.person_data.enrollments.find(
      (history) => history.id === id
    );
    current.enrollment = {
      value: newValue,
      updatedAt: new Date().toISOString(),
    };

    await setPersonCurrentDetails(newPerson);
  };

  return {
    activeHistory,
    handleAddHistory,
    handleDeleteHistory,
    handleStartDateChange,
    handleEndDateChange,
    handleEnrollmentChange,
  };
};

export default useEnrollments;
