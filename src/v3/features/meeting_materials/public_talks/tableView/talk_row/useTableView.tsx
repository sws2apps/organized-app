import { useRecoilValue } from 'recoil';
import { publicTalksFilteredState } from '@states/public_talks';

const useTableView = () => {
  const talksList = useRecoilValue(publicTalksFilteredState);

  return { talksList };
};

export default useTableView;
