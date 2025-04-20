import { useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { fullnameOptionState } from '@states/settings';
import { congregationsPersonsState } from '@states/app';

const useCongregationPersons = () => {
  const navigate = useNavigate();

  const fullnameOption = useAtomValue(fullnameOptionState);
  const users = useAtomValue(congregationsPersonsState);

  const handleOpenUserDetails = (value: string) => {
    navigate(`/manage-access/${value}`);
  };

  return { fullnameOption, handleOpenUserDetails, users };
};

export default useCongregationPersons;
