import { useRecoilValue } from 'recoil';
import { fullnameOptionState } from '@states/settings';
import { VisitingSpeakerType } from '@definition/visiting_speakers';

const useView = (speaker: VisitingSpeakerType) => {
  const fullnameOption = useRecoilValue(fullnameOptionState);

  const talks = speaker.talks
    .filter((record) => record._deleted === null)
    .map((record) => record.talk_number)
    .join(', ');

  return { talks, fullnameOption };
};

export default useView;
