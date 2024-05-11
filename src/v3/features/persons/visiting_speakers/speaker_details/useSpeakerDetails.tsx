import { useRecoilValue } from 'recoil';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { buildPersonFullname } from '@utils/common';
import { congNameState, congNumberState, fullnameOptionState } from '@states/settings';
import { speakersCongregationsState } from '@states/speakers_congregations';

const useSpeakerDetails = (speaker: VisitingSpeakerType) => {
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const congName = useRecoilValue(congNameState);
  const congNumber = useRecoilValue(congNumberState);
  const congregations = useRecoilValue(speakersCongregationsState);

  const personName = buildPersonFullname(speaker.person_lastname.value, speaker.person_firstname.value, fullnameOption);

  const speakerCongName =
    congNumber === speaker.cong_number
      ? congName
      : congregations.find((record) => record.cong_number === speaker.cong_number)?.cong_name.value;

  return { personName, speakerCongName };
};

export default useSpeakerDetails;
