import { useParams } from 'react-router-dom';

const usePersonDetails = () => {
  const { id } = useParams();

  const isNewPerson = id === undefined;

  return { isNewPerson };
};

export default usePersonDetails;
