import { useAtomValue } from 'jotai';
import { personsFilteredState } from '@states/persons';

const useAllPersons = () => {
  const persons = useAtomValue(personsFilteredState);

  return { persons };
};

export default useAllPersons;
