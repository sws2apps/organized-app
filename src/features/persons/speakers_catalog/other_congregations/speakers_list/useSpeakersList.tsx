import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { visitingSpeakersActiveState } from '@states/visiting_speakers';
import { speakersCongregationsState } from '@states/speakers_congregations';
import { speakersSortByName } from '@services/app/visiting_speakers';

const useSpeakersList = (cong_id: string) => {
  const visitingSpeakers = useAtomValue(visitingSpeakersActiveState);
  const congregations = useAtomValue(speakersCongregationsState);

  const [editSpeaker, setEditSpeaker] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const congregation = useMemo(() => {
    return congregations.find(
      (record) => record.id === cong_id && record._deleted.value === false
    );
  }, [congregations, cong_id]);

  const incomingSpeakers = useMemo(() => {
    const records = visitingSpeakers.filter(
      (record) => record.speaker_data.cong_id === cong_id
    );

    return speakersSortByName(records);
  }, [visitingSpeakers, cong_id]);

  const handleVisitingSpeakersAdd = () => setIsAdding(true);

  const handleOpenSpeakerEdit = (person_uid: string) => {
    setEditSpeaker(person_uid);
  };

  const handleCloseSpeakerEdit = () => {
    setEditSpeaker('');
    setIsAdding(false);
  };

  const speakerToEdit = useMemo(() => {
    return incomingSpeakers.find((record) => record.person_uid === editSpeaker);
  }, [incomingSpeakers, editSpeaker]);

  return {
    handleVisitingSpeakersAdd,
    incomingSpeakers,
    congregation,
    speakerToEdit,
    isAdding,
    handleOpenSpeakerEdit,
    handleCloseSpeakerEdit,
  };
};

export default useSpeakersList;
