import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { personCurrentDetailsState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/recoil/persons';

const useTimeAway = () => {
  const { id } = useParams();
  const isAddPerson = id === undefined;

  const person = useRecoilValue(personCurrentDetailsState);

  const activeTimeAway = person.person_data.timeAway.filter(
    (record) => record._deleted.value === false
  );

  const handleAddTimeAway = async () => {
    const newPerson = structuredClone(person);

    newPerson.person_data.timeAway.push({
      id: crypto.randomUUID(),
      start_date: {
        value: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      end_date: { value: null, updatedAt: '' },
      comments: { value: '', updatedAt: '' },
      _deleted: { value: false, updatedAt: '' },
    });

    await setPersonCurrentDetails(newPerson);
  };

  const handleDeleteTimeAway = async (id: string) => {
    const newPerson = structuredClone(person);

    if (!isAddPerson) {
      const current = newPerson.person_data.timeAway.find(
        (history) => history.id === id
      );
      current._deleted = { value: true, updatedAt: new Date().toISOString() };
    }

    if (isAddPerson) {
      newPerson.person_data.timeAway = newPerson.person_data.timeAway.filter(
        (record) => record.id !== id
      );
    }

    await setPersonCurrentDetails(newPerson);
  };

  const handleStartDateChange = async (id: string, value: Date) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.timeAway.find(
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

    const current = newPerson.person_data.timeAway.find(
      (history) => history.id === id
    );
    current.end_date = {
      value: value === null ? null : value.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setPersonCurrentDetails(newPerson);
  };

  const handleCommentsChange = async (id: string, value: string) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.timeAway.find(
      (history) => history.id === id
    );
    current.comments = { value, updatedAt: new Date().toISOString() };

    await setPersonCurrentDetails(newPerson);
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
