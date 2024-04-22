import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { personCurrentDetailsState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/recoil/persons';

const usePersons = () => {
  const navigate = useNavigate();

  const person = useRecoilValue(personCurrentDetailsState);

  const handleAddNewPerson = async () => {
    const newPerson = structuredClone(person);
    newPerson.person_uid = crypto.randomUUID();

    await setPersonCurrentDetails(newPerson);

    navigate('/persons/new');
  };

  return { handleAddNewPerson };
};

export default usePersons;
