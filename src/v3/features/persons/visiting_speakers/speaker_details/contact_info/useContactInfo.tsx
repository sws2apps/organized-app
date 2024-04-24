import { useRecoilValue } from 'recoil';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { personsActiveState } from '@states/persons';

const useContactInfo = (speaker: VisitingSpeakerType) => {
  const persons = useRecoilValue(personsActiveState);

  const person = persons.find((record) => record.person_uid === speaker.person_uid);

  return { person };
};

export default useContactInfo;
