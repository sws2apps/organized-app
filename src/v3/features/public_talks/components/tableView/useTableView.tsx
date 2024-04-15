import { useRecoilValue } from 'recoil';
import { publicTalksFilteredState } from '@states/publicTalks';

const useTableView = () => {
  const talksList = useRecoilValue(publicTalksFilteredState);

  return { talksList };
};

export default useTableView;
