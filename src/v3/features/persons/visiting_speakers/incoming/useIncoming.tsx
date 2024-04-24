import { useRecoilValue } from 'recoil';
import { incomingCongSpeakersState } from '@states/speakers_congregations';

const useIncoming = () => {
  const incomingCongs = useRecoilValue(incomingCongSpeakersState);

  return { incomingCongs };
};

export default useIncoming;
