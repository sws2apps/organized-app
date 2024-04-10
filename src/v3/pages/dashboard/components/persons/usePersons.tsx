import { useResetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { personCurrentDetailsState } from '@states/persons';

const usePersons = () => {
  const navigate = useNavigate();

  const resetPersonCurrent = useResetRecoilState(personCurrentDetailsState);

  const handleAddNewPerson = () => {
    resetPersonCurrent();
    navigate('/persons/new');
  };

  return { handleAddNewPerson };
};

export default usePersons;
