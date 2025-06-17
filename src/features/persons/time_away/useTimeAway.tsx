import { useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import { personCurrentDetailsState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/states/persons';
import { formatDate } from '@utils/date';
import { personsFilterActiveTimeAway } from '@services/app/persons';

const useTimeAway = () => {
  const { id } = useParams();
  const isAddPerson = id === undefined;

  const person = useAtomValue(personCurrentDetailsState);

  const activeTimeAway = personsFilterActiveTimeAway(
    person.person_data.timeAway
  );

  const handleAddTimeAway = async () => {
    const newPerson = structuredClone(person);

    newPerson.person_data.timeAway.push({
      id: crypto.randomUUID(),
      _deleted: false,
      updatedAt: new Date().toISOString(),
      start_date: formatDate(new Date(), 'yyyy/MM/dd'),
      end_date: null,
      comments: '',
    });

    setPersonCurrentDetails(newPerson);
  };

  const handleDeleteTimeAway = async (id: string) => {
    const newPerson = structuredClone(person);

    if (!isAddPerson) {
      const current = newPerson.person_data.timeAway.find(
        (history) => history.id === id
      );

      current._deleted = true;
      current.updatedAt = new Date().toISOString();
    }

    if (isAddPerson) {
      newPerson.person_data.timeAway = newPerson.person_data.timeAway.filter(
        (record) => record.id !== id
      );
    }

    setPersonCurrentDetails(newPerson);
  };

  const handleStartDateChange = async (id: string, value: Date) => {
    if (value === null) return;

    const newPerson = structuredClone(person);

    const current = newPerson.person_data.timeAway.find(
      (history) => history.id === id
    );

    current.start_date = formatDate(value, 'yyyy/MM/dd');
    current.updatedAt = new Date().toISOString();

    setPersonCurrentDetails(newPerson);
  };

  const handleEndDateChange = async (id: string, value: Date | null) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.timeAway.find(
      (history) => history.id === id
    );

    current.end_date = value === null ? null : formatDate(value, 'yyyy/MM/dd');
    current.updatedAt = new Date().toISOString();

    setPersonCurrentDetails(newPerson);
  };

  const handleCommentsChange = async (id: string, value: string) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.timeAway.find(
      (history) => history.id === id
    );

    current.comments = value;
    current.updatedAt = new Date().toISOString();

    setPersonCurrentDetails(newPerson);
  };

  return {
    handleAddTimeAway,
    activeTimeAway,
    handleDeleteTimeAway,
    handleStartDateChange,
    handleEndDateChange,
    handleCommentsChange,
  };
};

export default useTimeAway;
