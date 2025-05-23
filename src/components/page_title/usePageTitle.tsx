import { useNavigate } from 'react-router';

/**
 * Hook for managing page title functionality, including navigation to the specified route link.
 * @returns An object containing the function to handle the arrow back action.
 */
const usePageTitle = () => {
  const navigate = useNavigate();

  const handleArrowBackAction = () => {
    navigate(-1);
  };

  return { handleArrowBackAction };
};

export default usePageTitle;
