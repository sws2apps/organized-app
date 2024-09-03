import { useRecoilValue } from 'recoil';
import { personsActiveState } from '@states/persons';
import usePerson from './usePerson';

const usePersons = () => {
  const { personIsActivePublisher, personIsPublisher } = usePerson();

  const persons = useRecoilValue(personsActiveState);

  const getPublishersActive = (month: string) => {
    const result = persons.filter((record) => {
      const isPublisher = personIsPublisher(record, month);
      if (!isPublisher) return false;

      const isActive = personIsActivePublisher(record, month);
      return isActive;
    });

    return result;
  };

  return { getPublishersActive };
};

export default usePersons;
