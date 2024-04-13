import { useRecoilValue } from 'recoil';
import { personsFilteredState } from '@states/persons';

const useList = () => {
  const persons = useRecoilValue(personsFilteredState);

  return { persons };
};

export default useList;
