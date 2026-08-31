import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { localSpeakersState } from '@states/visiting_speakers';
import { speakersSortByName } from '@services/app/visiting_speakers';
import { personsActiveState, personsByViewState } from '@states/persons';

const useSeakersLocal = () => {
  const localSpeakers = useAtomValue(localSpeakersState);
  const persons = useAtomValue(personsActiveState);
  const personsByView = useAtomValue(personsByViewState);

  const speakers = useMemo(() => {
    const data = speakersSortByName(localSpeakers);

    return data.filter((record) => {
      const person = persons.some(
        (person) => person.person_uid === record.person_uid
      );

      if (!person) return true;

      const personInView = personsByView.some(
        (person) => person.person_uid === record.person_uid
      );

      return personInView;
    });
  }, [localSpeakers, personsByView, persons]);

  const [editSpeaker, setEditSpeaker] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSpeakerAdd = () => setIsAdding(true);

  const handleOpenSpeakerEdit = (person_uid: string) => {
    setEditSpeaker(person_uid);
  };

  const handleCloseSpeakerEdit = () => {
    setEditSpeaker('');
    setIsAdding(false);
  };

  const speakerToEdit = useMemo(() => {
    return speakers.find((record) => record.person_uid === editSpeaker);
  }, [speakers, editSpeaker]);

  return {
    speakers,
    handleSpeakerAdd,
    speakerToEdit,
    isAdding,
    handleOpenSpeakerEdit,
    handleCloseSpeakerEdit,
  };
};

export default useSeakersLocal;
