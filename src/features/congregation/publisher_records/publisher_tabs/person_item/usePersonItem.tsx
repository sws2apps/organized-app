import { useNavigate } from 'react-router-dom';
import { PersonType } from '@definition/person';

const usePersonItem = (person: PersonType) => {
  const navigate = useNavigate();

  const handleOpenPublisher = () => {
    navigate(`/publisher-records/${person.person_uid}`);
  };

  return { handleOpenPublisher };
};

export default usePersonItem;
