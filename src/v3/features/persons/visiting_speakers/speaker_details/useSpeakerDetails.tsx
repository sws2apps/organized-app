import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { buildPersonFullname } from '@utils/common';
import { personsActiveState } from '@states/persons';
import { personIsElder } from '@services/app/persons';
import { congNameState, fullnameOptionState } from '@states/settings';

const useSpeakerDetails = (speaker: VisitingSpeakerType) => {
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const persons = useRecoilValue(personsActiveState);
  const congName = useRecoilValue(congNameState);

  const [isEdit, setIsEdit] = useState(false);

  const person = persons.find((record) => record.person_uid === speaker.person_uid);

  const personName = buildPersonFullname(speaker.person_lastname.value, speaker.person_firstname.value, fullnameOption);

  const isElder = personIsElder(person);

  const handleToggleEdit = () => setIsEdit((prev) => !prev);

  return { personName, isElder, congName, handleToggleEdit, isEdit };
};

export default useSpeakerDetails;
