import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { dbVistingSpeakersLocalCongSpeakerAdd } from '@services/dexie/visiting_speakers';
import { outgoingSpeakersState } from '@states/visiting_speakers';
import { personsActiveState } from '@states/persons';

const useOutgoing = () => {
  const outgoingSpeakers = useRecoilValue(outgoingSpeakersState);
  const persons = useRecoilValue(personsActiveState);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const localSpeakers = outgoingSpeakers
    .map((speaker) => {
      const findPerson = persons.find((record) => record.person_uid === speaker.person_uid);

      return {
        ...speaker,
        person_display_name: { value: findPerson?.person_display_name.value || '', updatedAt: '' },
        person_firstname: { value: findPerson?.person_firstname.value || '', updatedAt: '' },
        person_lastname: { value: findPerson?.person_lastname.value || '', updatedAt: '' },
      };
    })
    .sort((a, b) => {
      if (a.person_lastname.value === '') return 1;
      if (b.person_lastname.value === '') return -1;
      if (a.person_lastname.value < b.person_lastname.value) return -1;
      if (a.person_lastname.value > b.person_lastname.value) return 1;
      return 0;
    });

  const handleToggleExpanded = () => setIsExpanded((prev) => !prev);

  const handleToggleEdit = () => {
    setIsEditMode((prev) => {
      if (!prev) {
        setIsExpanded((prev) => {
          if (!prev) return !prev;
          return prev;
        });
      }
      return !prev;
    });
  };

  const handleSpeakerAdd = async () => {
    await dbVistingSpeakersLocalCongSpeakerAdd();
  };

  return {
    isExpanded,
    handleToggleExpanded,
    outgoingSpeakers,
    isEditMode,
    handleToggleEdit,
    handleSpeakerAdd,
    localSpeakers,
  };
};

export default useOutgoing;
