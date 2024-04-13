import { useRecoilValue } from 'recoil';
import { personsFilteredState } from '@states/persons';

const useAllPersons = () => {
  const persons = useRecoilValue(personsFilteredState);

  return { persons };
};

export default useAllPersons;
