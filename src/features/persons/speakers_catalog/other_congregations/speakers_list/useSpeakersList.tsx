import { useRecoilValue } from 'recoil';
import { dbVisitingSpeakersAdd } from '@services/dexie/visiting_speakers';
import { buildPersonFullname } from '@utils/common';
import { fullnameOptionState } from '@states/settings';
import { visitingSpeakersState } from '@states/visiting_speakers';
import { speakersCongregationsState } from '@states/speakers_congregations';

const useSpeakersList = (cong_id: string, isEdit: boolean) => {
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const visitingSpeakers = useRecoilValue(visitingSpeakersState);
  const congregations = useRecoilValue(speakersCongregationsState);

  const congregation = congregations.find(
    (record) => record.id === cong_id && record._deleted.value === false
  );

  const filteredList = visitingSpeakers.filter(
    (record) =>
      record._deleted.value === false && record.speaker_data.cong_id === cong_id
  );

  const incomingSpeakers = isEdit
    ? filteredList
    : filteredList.sort((a, b) => {
        const fullnameA = buildPersonFullname(
          a.speaker_data.person_lastname.value,
          a.speaker_data.person_firstname.value,
          fullnameOption
        );
        const fullnameB = buildPersonFullname(
          b.speaker_data.person_lastname.value,
          b.speaker_data.person_firstname.value,
          fullnameOption
        );

        if (fullnameA === '') return 1;
        if (fullnameB === '') return -1;

        return fullnameA.localeCompare(fullnameB);
      });

  const handleVisitingSpeakersAdd = async (cong_id: string) => {
    await dbVisitingSpeakersAdd(cong_id);
  };

  return { handleVisitingSpeakersAdd, incomingSpeakers, congregation };
};

export default useSpeakersList;
