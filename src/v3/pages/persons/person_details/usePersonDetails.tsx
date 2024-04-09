import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { personCurrentDetailsState } from '@states/persons';

const usePersonDetails = () => {
  const { id } = useParams();

  const person = useRecoilValue(personCurrentDetailsState);

  const isNewPerson = id === undefined;

  const isBaptized = person.baptizedPublisher.active.value;
  const isMale = person.isMale.value;

  return { isNewPerson, isBaptized, isMale };
};

export default usePersonDetails;
