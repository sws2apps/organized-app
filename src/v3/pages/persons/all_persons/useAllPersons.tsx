import { personCurrentDetailsState } from '@states/persons';
import { useNavigate } from 'react-router-dom';
import { useResetRecoilState } from 'recoil';

const useAllPersons = () => {
  const navigate = useNavigate();

  const resetPersonNew = useResetRecoilState(personCurrentDetailsState);

  const handlePersonAdd = () => {
    resetPersonNew();
    navigate('/persons/new');
  };

  return { handlePersonAdd };
};

export default useAllPersons;
