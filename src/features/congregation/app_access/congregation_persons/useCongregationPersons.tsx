import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { fullnameOptionState } from '@states/settings';
import { congregationsPersonsState } from '@states/app';

const useCongregationPersons = () => {
  const navigate = useNavigate();

  const fullnameOption = useRecoilValue(fullnameOptionState);
  const users = useRecoilValue(congregationsPersonsState);

  const handleOpenUserDetails = (value: string) => {
    navigate(`/manage-access/${value}`);
  };

  return { fullnameOption, handleOpenUserDetails, users };
};

export default useCongregationPersons;
