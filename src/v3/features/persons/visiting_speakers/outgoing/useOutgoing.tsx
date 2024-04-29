import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { buildPersonFullname } from '@utils/common';
import { dbVistingSpeakersLocalCongSpeakerAdd } from '@services/dexie/visiting_speakers';
import { outgoingSpeakersState } from '@states/visiting_speakers';
import { personsActiveState } from '@states/persons';
import { fullnameOptionState } from '@states/settings';
import { personIsElder, personIsMS } from '@services/app/persons';

const useOutgoing = () => {
  const outgoingSpeakers = useRecoilValue(outgoingSpeakersState);
  const persons = useRecoilValue(personsActiveState);
  const fullnameOption = useRecoilValue(fullnameOptionState);

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
        elder: { value: findPerson ? personIsElder(findPerson) : false, updatedAt: '' },
        ministerial_servant: { value: findPerson ? personIsMS(findPerson) : false, updatedAt: '' },
        person_email: { value: findPerson?.email.value || '', updatedAt: '' },
        person_phone: { value: findPerson?.phone.value || '', updatedAt: '' },
      };
    })
    .sort((a, b) => {
      const fullnameA = buildPersonFullname(a.person_lastname.value, a.person_firstname.value, fullnameOption);
      const fullnameB = buildPersonFullname(b.person_lastname.value, b.person_firstname.value, fullnameOption);

      if (fullnameA === '') return 1;
      if (fullnameB === '') return -1;

      if (fullnameA < fullnameB) return -1;
      if (fullnameB > fullnameB) return 1;
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
