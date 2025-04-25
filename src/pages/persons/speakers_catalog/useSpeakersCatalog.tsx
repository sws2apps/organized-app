import { useSetAtom } from 'jotai';
import { isAddingCongregationState } from '@states/speakers_congregations';

const useSpeakersCatalog = () => {
  const setIsAdding = useSetAtom(isAddingCongregationState);

  const handleIsAddingOpen = () => setIsAdding(true);

  return { handleIsAddingOpen };
};

export default useSpeakersCatalog;
