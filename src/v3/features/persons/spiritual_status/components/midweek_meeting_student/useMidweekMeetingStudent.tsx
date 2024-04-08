import { useRecoilValue } from 'recoil';
import { personCurrentDetailsState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/recoil/persons';

const useMidweekMeetingStudent = () => {
  const person = useRecoilValue(personCurrentDetailsState);

  const handleAddHistory = async () => {
    const newPerson = structuredClone(person);

    newPerson.midweekMeetingStudent.history.push({
      id: crypto.randomUUID(),
      startDate: { value: new Date().toISOString(), updatedAt: new Date().toISOString() },
      endDate: { value: null, updatedAt: new Date().toISOString() },
    });

    await setPersonCurrentDetails(newPerson);
  };

  const handleDeleteHistory = async (id: string) => {
    const newPerson = structuredClone(person);

    newPerson.midweekMeetingStudent.history = newPerson.midweekMeetingStudent.history.filter(
      (history) => history.id !== id
    );

    newPerson.midweekMeetingStudent._deleted = newPerson.midweekMeetingStudent._deleted.filter(
      (history) => history.id !== id
    );
    newPerson.midweekMeetingStudent._deleted.push({ id, on: new Date().toISOString() });

    await setPersonCurrentDetails(newPerson);
  };

  const handleStartDateChange = async (id: string, value: Date) => {
    const newPerson = structuredClone(person);

    const current = newPerson.midweekMeetingStudent.history.find((history) => history.id === id);
    current.startDate = {
      value: value.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setPersonCurrentDetails(newPerson);
  };

  const handleEndDateChange = async (id: string, value: Date | null) => {
    const newPerson = structuredClone(person);

    const current = newPerson.midweekMeetingStudent.history.find((history) => history.id === id);
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
  };
};

export default useMidweekMeetingStudent;
