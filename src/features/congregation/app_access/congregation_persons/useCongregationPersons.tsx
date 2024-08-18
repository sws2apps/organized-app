import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { fullnameOptionState } from '@states/settings';

const useCongregationPersons = () => {
  const navigate = useNavigate();

  const fullnameOption = useRecoilValue(fullnameOptionState);

  const handleOpenUserDetails = (value: string) => {
    navigate(`/manage-access/${value}`);
  };

  return { fullnameOption, handleOpenUserDetails };
};

export default useCongregationPersons;
