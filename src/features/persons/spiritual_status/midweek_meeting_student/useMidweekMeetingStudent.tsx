import { useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import { personCurrentDetailsState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/states/persons';

const useMidweekMeetingStudent = () => {
  const { id } = useParams();
  const isAddPerson = id === undefined;

  const person = useAtomValue(personCurrentDetailsState);

  const activeHistory =
    person.person_data.midweek_meeting_student.history.filter(
      (record) => record._deleted === false
    );

  const handleAddHistory = async () => {
    const newPerson = structuredClone(person);

    newPerson.person_data.midweek_meeting_student.history.push({
      id: crypto.randomUUID(),
      _deleted: false,
      updatedAt: new Date().toISOString(),
      start_date: new Date().toISOString(),
      end_date: null,
    });

    setPersonCurrentDetails(newPerson);
  };

  const handleDeleteHistory = async (id: string) => {
    const newPerson = structuredClone(person);

    if (!isAddPerson) {
      const current =
        newPerson.person_data.midweek_meeting_student.history.find(
          (history) => history.id === id
        );

      current._deleted = true;
      current.updatedAt = new Date().toISOString();
    }

    if (isAddPerson) {
      newPerson.person_data.midweek_meeting_student.history =
        newPerson.person_data.midweek_meeting_student.history.filter(
          (record) => record.id !== id
        );
    }

    setPersonCurrentDetails(newPerson);
  };

  const handleStartDateChange = async (id: string, value: Date) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.midweek_meeting_student.history.find(
      (history) => history.id === id
    );

    current.start_date = value.toISOString();
    current.updatedAt = new Date().toISOString();

    setPersonCurrentDetails(newPerson);
  };

  const handleEndDateChange = async (id: string, value: Date | null) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.midweek_meeting_student.history.find(
      (history) => history.id === id
    );

    current.end_date = value === null ? null : value.toISOString();
    current.updatedAt = new Date().toISOString();

    setPersonCurrentDetails(newPerson);
  };

  return {
    handleAddHistory,
    handleDeleteHistory,
    handleStartDateChange,
    handleEndDateChange,
    activeHistory,
  };
};

export default useMidweekMeetingStudent;
