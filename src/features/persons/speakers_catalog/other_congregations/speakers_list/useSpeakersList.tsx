import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { dbVisitingSpeakersAdd } from '@services/dexie/visiting_speakers';
import { visitingSpeakersActiveState } from '@states/visiting_speakers';
import { speakersCongregationsState } from '@states/speakers_congregations';
import { speakersSortByName } from '@services/app/visiting_speakers';

const useSpeakersList = (cong_id: string, isEdit: boolean) => {
  const visitingSpeakers = useAtomValue(visitingSpeakersActiveState);
  const congregations = useAtomValue(speakersCongregationsState);

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
    return isEdit ? filteredList : speakersSortByName(filteredList);
  }, [filteredList, isEdit]);

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
