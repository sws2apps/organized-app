import { useSetRecoilState } from 'recoil';
import { isAddingCongregationState } from '@states/speakers_congregations';

const useVisitingSpeakers = () => {
  const setIsAdding = useSetRecoilState(isAddingCongregationState);

  const handleIsAddingOpen = () => setIsAdding(true);

  return { handleIsAddingOpen };
};

export default useVisitingSpeakers;
