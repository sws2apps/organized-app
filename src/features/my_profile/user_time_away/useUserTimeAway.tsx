import { useMemo } from 'react';
import { dbPersonsSave } from '@services/dexie/persons';
import { formatDate } from '@services/dateformat';
import useCurrentUser from '@hooks/useCurrentUser';

const useUserTimeAway = () => {
  const { person } = useCurrentUser();

  const allRecords = useMemo(() => {
    const all = person.person_data.timeAway;

    return all.filter((record) => record._deleted === false);
  }, [person]);

  const handleAdd = async () => {
    const newPerson = structuredClone(person);

    newPerson.person_data.timeAway.push({
      id: crypto.randomUUID(),
      _deleted: false,
      updatedAt: new Date().toISOString(),
      start_date: formatDate(new Date(), 'yyyy/MM/dd'),
      end_date: null,
      comments: '',
    });

    await dbPersonsSave(newPerson);
  };

  const handleStartDateChange = async (id: string, value: Date) => {
    value = value || new Date();

    const newPerson = structuredClone(person);

    const item = newPerson.person_data.timeAway.find(
      (record) => record.id === id
    );
    item.updatedAt = new Date().toISOString();
    item.start_date = formatDate(value, 'yyyy/MM/dd');

    await dbPersonsSave(newPerson);
  };

  const handleEndDateChange = async (id: string, value: Date) => {
    const newPerson = structuredClone(person);

    const item = newPerson.person_data.timeAway.find(
      (record) => record.id === id
    );
    item.updatedAt = new Date().toISOString();
    item.end_date = value === null ? null : formatDate(value, 'yyyy/MM/dd');

    await dbPersonsSave(newPerson);
  };

  const handleCommentsChange = async (id: string, value: string) => {
    const newPerson = structuredClone(person);

    const item = newPerson.person_data.timeAway.find(
      (record) => record.id === id
    );
    item.updatedAt = new Date().toISOString();
    item.comments = value;

    await dbPersonsSave(newPerson);
  };

  const handleDelete = async (id: string) => {
    const newPerson = structuredClone(person);

    const item = newPerson.person_data.timeAway.find(
      (record) => record.id === id
    );

    item.updatedAt = new Date().toISOString();
    item._deleted = true;

    await dbPersonsSave(newPerson);
  };

  return {
    allRecords,
    handleAdd,
    handleStartDateChange,
    handleEndDateChange,
    handleCommentsChange,
    handleDelete,
  };
};

export default useUserTimeAway;
