import { useRecoilValue } from 'recoil';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { buildPersonFullname } from '@utils/common';
import { congNameState, fullnameOptionState } from '@states/settings';

const useSpeakerDetails = (speaker: VisitingSpeakerType) => {
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const congName = useRecoilValue(congNameState);

  const personName = buildPersonFullname(speaker.person_lastname.value, speaker.person_firstname.value, fullnameOption);

  return { personName, congName };
};

export default useSpeakerDetails;
