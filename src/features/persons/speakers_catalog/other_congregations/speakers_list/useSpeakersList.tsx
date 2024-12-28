import { useRecoilValue } from 'recoil';
import { dbVisitingSpeakersAdd } from '@services/dexie/visiting_speakers';
import { buildPersonFullname } from '@utils/common';
import { fullnameOptionState } from '@states/settings';
import { visitingSpeakersState } from '@states/visiting_speakers';
import { speakersCongregationsState } from '@states/speakers_congregations';
import { useEffect, useRef, useState } from 'react';

const useSpeakersList = (cong_id: string, isEdit: boolean) => {
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const visitingSpeakers = useRecoilValue(visitingSpeakersState);
  const congregations = useRecoilValue(speakersCongregationsState);

  const [visitingSpeakersBuffer, setVisitingSpeakersBuffer] =
    useState(visitingSpeakers);

  useEffect(() => {
    const prevVisitingSpeakersBuffer = visitingSpeakersBufferRef.current;

    if (visitingSpeakers.length > prevVisitingSpeakersBuffer.length) {
      const newSpeakers = visitingSpeakers.filter(
        (speaker) =>
          !prevVisitingSpeakersBuffer.some(
            (item) => item.person_uid === speaker.person_uid
          )
      );

      setVisitingSpeakersBuffer((prev) => [...prev, ...newSpeakers]);
      return;
    }

    const updatedSpeakers = prevVisitingSpeakersBuffer.map((bufferSpeaker) => {
      const updatedSpeaker = visitingSpeakers.find(
        (speaker) =>
          bufferSpeaker.person_uid === speaker.person_uid &&
          bufferSpeaker._deleted.value !== speaker._deleted.value
      );
      return updatedSpeaker || bufferSpeaker;
    });

    setVisitingSpeakersBuffer(updatedSpeakers);
  }, [visitingSpeakers]);

  const visitingSpeakersBufferRef = useRef(visitingSpeakersBuffer);

  useEffect(() => {
    visitingSpeakersBufferRef.current = visitingSpeakersBuffer;
  }, [visitingSpeakersBuffer]);

  const congregation = congregations.find(
    (record) => record.id === cong_id && record._deleted.value === false
  );

  const filteredList = visitingSpeakersBuffer.filter(
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
