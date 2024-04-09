import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { personCurrentDetailsState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/recoil/persons';

const useUnbaptizedPublisher = () => {
  const { id } = useParams();
  const isNewPerson = id === undefined;

  const person = useRecoilValue(personCurrentDetailsState);

  const activeHistory = person.unbaptizedPublisher.history.filter((record) => record._deleted === null);

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
      startDate: { value: new Date().toISOString(), updatedAt: new Date().toISOString() },
      endDate: { value: null, updatedAt: new Date().toISOString() },
      _deleted: null,
    });

    await setPersonCurrentDetails(newPerson);
  };

  const handleDeleteHistory = async (id: string) => {
    const newPerson = structuredClone(person);

    if (!isNewPerson) {
      const current = newPerson.unbaptizedPublisher.history.find((history) => history.id === id);
      current._deleted = new Date().toISOString();
    }

    if (isNewPerson) {
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
  };
};

export default useUnbaptizedPublisher;
