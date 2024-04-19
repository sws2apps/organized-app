import { useNavigate } from 'react-router-dom';

/**
 * Hook for managing page title functionality, including navigation to the specified route link.
 * @param routeLink - The route link to navigate back to when the arrow back action is triggered.
 * @returns An object containing the function to handle the arrow back action.
 */
const usePageTitle = (routeLink: string) => {
  const navigate = useNavigate();

  const handleArrowBackAction = () => {
    navigate(routeLink);
  };

  return { handleArrowBackAction };
};

export default usePageTitle;
