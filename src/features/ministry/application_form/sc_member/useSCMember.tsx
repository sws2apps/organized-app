import { useParams } from 'react-router-dom';

const useSCMember = () => {
  const { id } = useParams();

  const isEdit = id !== undefined;

  return { isEdit };
};

export default useSCMember;
