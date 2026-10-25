import { useAppTranslation } from '@hooks/index';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import useUpNavigation from '@hooks/useUpNavigation';

type ParentState = { parent?: string };

// the trail useNavigationTrail keeps: the path of every history entry by its index
const previousPath = () => {
  const idx = (window.history.state as { idx?: unknown } | null)?.idx;
  if (!Number.isInteger(idx) || (idx as number) < 1) return undefined;

  try {
    const trail = JSON.parse(
      sessionStorage.getItem('organized.navigationTrail') ?? '{}'
    ) as Record<string, string>;

    return trail[(idx as number) - 1];
  } catch {
    return undefined;
  }
};

// sub-pages show the page they were opened from under their title; when the
// page is opened directly (a link or a reload) the usual parent stands in.
// Opened from the dashboard they are top-level pages, without one
const useParentPage = (
  fallbackTitle = 'tr_allTerritories',
  fallbackPath = '/territories'
) => {
  const { t } = useAppTranslation();

  const navigate = useNavigate();
  const { goUp } = useUpNavigation();

  const fromState = (useLocation().state as ParentState | null)?.parent;

  const fromDashboard = !fromState && previousPath() === '/';

  const goBack = useCallback(() => {
    // opened from a page inside the app: that page is the previous entry
    if (fromState || fromDashboard) navigate(-1);
    else goUp(fallbackPath);
  }, [fromState, fromDashboard, navigate, goUp, fallbackPath]);

  const parent = fromDashboard ? undefined : t(fromState ?? fallbackTitle);

  return { parent, goBack };
};

export default useParentPage;
