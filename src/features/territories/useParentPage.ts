import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import useUpNavigation from '@hooks/useUpNavigation';

type ParentState = { parent?: string };

// sub-pages show the page they were opened from under their title; when the
// page is opened directly (a link or a reload) the usual parent stands in
const useParentPage = (
  fallbackTitle = 'All territories',
  fallbackPath = '/territories'
) => {
  const navigate = useNavigate();
  const { goUp } = useUpNavigation();

  const fromState = (useLocation().state as ParentState | null)?.parent;

  const goBack = useCallback(() => {
    // opened from a page inside the app: that page is the previous entry
    if (fromState) navigate(-1);
    else goUp(fallbackPath);
  }, [fromState, navigate, goUp, fallbackPath]);

  return { parent: fromState ?? fallbackTitle, goBack };
};

export default useParentPage;
