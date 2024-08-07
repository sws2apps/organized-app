import { useRecoilValue } from 'recoil';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { buildPersonFullname } from '@utils/common';
import {
  congNameState,
  congNumberState,
  fullnameOptionState,
} from '@states/settings';
import { speakersCongregationsState } from '@states/speakers_congregations';

const useSpeakerDetails = (speaker: VisitingSpeakerType) => {
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const congName = useRecoilValue(congNameState);
  const congNumber = useRecoilValue(congNumberState);
  const congregations = useRecoilValue(speakersCongregationsState);

  const personName = buildPersonFullname(
    speaker.speaker_data.person_lastname.value,
    speaker.speaker_data.person_firstname.value,
    fullnameOption
  );

  const congId = congregations.find(
    (record) => record.cong_data.cong_number.value === congNumber
  )?.id;

  const speakerCongName =
    congId === speaker.speaker_data.cong_id
      ? congName
      : congregations.find(
          (record) => record.id === speaker.speaker_data.cong_id
        )?.cong_data.cong_name.value;

  return { personName, speakerCongName };
};

export default useSpeakerDetails;
