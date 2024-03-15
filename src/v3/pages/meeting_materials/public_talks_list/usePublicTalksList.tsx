import { useRecoilValue } from 'recoil';
import { congAccountConnectedState } from '@states/app';
import { publicTalksLocaleState } from '@states/publicTalks';

const usePublicTalksList = () => {
  const isConnected = useRecoilValue(congAccountConnectedState);
  const talksList = useRecoilValue(publicTalksLocaleState);

  console.log(talksList);

  return { isConnected };
};

export default usePublicTalksList;
