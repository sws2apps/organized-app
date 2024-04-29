import { useRecoilValue } from 'recoil';
import { dbVistingSpeakersAdd } from '@services/dexie/visiting_speakers';
import { buildPersonFullname } from '@utils/common';
import { fullnameOptionState } from '@states/settings';
import { visitingSpeakersState } from '@states/visiting_speakers';

const useSpeakersList = (cong_number: string) => {
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const visitingSpeakers = useRecoilValue(visitingSpeakersState);

  const incomingSpeakers = visitingSpeakers
    .filter((record) => record._deleted === null && record.cong_number === cong_number)
    .sort((a, b) => {
      const fullnameA = buildPersonFullname(a.person_lastname.value, a.person_firstname.value, fullnameOption);
      const fullnameB = buildPersonFullname(b.person_lastname.value, b.person_firstname.value, fullnameOption);

      if (fullnameA === '') return 1;
      if (fullnameB === '') return -1;

      return fullnameA.localeCompare(fullnameB);
    });

  const handleVisitingSpeakersAdd = async (cong_number: string) => {
    await dbVistingSpeakersAdd(cong_number);
  };

  return { handleVisitingSpeakersAdd, incomingSpeakers };
};

export default useSpeakersList;
