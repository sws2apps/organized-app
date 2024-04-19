import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { personCurrentDetailsState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/recoil/persons';

const useAllPersons = () => {
  const navigate = useNavigate();

  const person = useRecoilValue(personCurrentDetailsState);

  const handlePersonAdd = async () => {
    const newPerson = structuredClone(person);
    newPerson.person_uid = crypto.randomUUID();

    await setPersonCurrentDetails(newPerson);

    navigate('/persons/new');
  };

  const handleGetDummyPersons = async () => {
    const { importDummyPersons } = await import('@utils/dev');

    await importDummyPersons();
  };

  return { handlePersonAdd, handleGetDummyPersons };
};

export default useAllPersons;
