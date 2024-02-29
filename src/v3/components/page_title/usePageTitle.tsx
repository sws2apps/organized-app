import { useNavigate } from 'react-router-dom';

const usePageTitle = (routeLink: string) => {
  const navigate = useNavigate();

  const handleArrowBackAction = () => {
    navigate(routeLink);
  };

  return { handleArrowBackAction };
};

export default usePageTitle;
