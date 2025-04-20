import { useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { fullnameOptionState } from '@states/settings';
import { congregationsBaptizedPersonsState } from '@states/app';

const useCongregationBaptized = () => {
  const navigate = useNavigate();

  const fullnameOption = useAtomValue(fullnameOptionState);
  const users = useAtomValue(congregationsBaptizedPersonsState);

  const handleOpenUserDetails = (value: string) => {
    navigate(`/manage-access/${value}`);
  };

  return { fullnameOption, handleOpenUserDetails, users };
};

export default useCongregationBaptized;
