import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { fullnameOptionState } from '@states/settings';
import { congregationsBaptizedPersonsState } from '@states/app';

const useCongregationBaptized = () => {
  const navigate = useNavigate();

  const fullnameOption = useRecoilValue(fullnameOptionState);
  const users = useRecoilValue(congregationsBaptizedPersonsState);

  const handleOpenUserDetails = (value: string) => {
    navigate(`/manage-access/${value}`);
  };

  return { fullnameOption, handleOpenUserDetails, users };
};

export default useCongregationBaptized;
