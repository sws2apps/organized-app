import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { dbVisitingSpeakersAdd } from '@services/dexie/visiting_speakers';
import { buildPersonFullname } from '@utils/common';
import { fullnameOptionState } from '@states/settings';
import { visitingSpeakersActiveState } from '@states/visiting_speakers';
import { speakersCongregationsState } from '@states/speakers_congregations';

const useSpeakersList = (cong_id: string, isEdit: boolean) => {
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const visitingSpeakers = useRecoilValue(visitingSpeakersActiveState);
  const congregations = useRecoilValue(speakersCongregationsState);

  const [speakers, setSpeakers] = useState(visitingSpeakers);

  const congregation = useMemo(() => {
    return congregations.find(
      (record) => record.id === cong_id && record._deleted.value === false
    );
  }, [congregations, cong_id]);

  const filteredList = useMemo(() => {
    return speakers.filter((record) => record.speaker_data.cong_id === cong_id);
  }, [speakers, cong_id]);

  const incomingSpeakers = useMemo(() => {
    return isEdit
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
  }, [filteredList, isEdit, fullnameOption]);

  const handleVisitingSpeakersAdd = async (cong_id: string) => {
    await dbVisitingSpeakersAdd(cong_id);
  };

  useEffect(() => {
    setSpeakers((prev) => {
      const data = prev.filter((record) =>
        visitingSpeakers.some((s) => s.person_uid === record.person_uid)
      );

      for (const speaker of visitingSpeakers) {
        const index = data.findIndex(
          (record) => record.person_uid === speaker.person_uid
        );

        if (index !== -1) {
          data[index] = speaker;
        }

        if (index === -1) {
          data.push(speaker);
        }
      }

      return data;
    });
  }, [visitingSpeakers]);

  return { handleVisitingSpeakersAdd, incomingSpeakers, congregation };
};

export default useSpeakersList;
