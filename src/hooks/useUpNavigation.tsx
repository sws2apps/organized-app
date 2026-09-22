import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router';

// the router numbers every history entry (history.state.idx); remembering which
// path sits at each number tells whether "back" really leads where "up" should
const TRAIL_KEY = 'organized.navigationTrail';

type Trail = Record<string, string>;

const readTrail = (): Trail => {
  try {
    return JSON.parse(sessionStorage.getItem(TRAIL_KEY) ?? '{}') as Trail;
  } catch {
    return {};
  }
};

const writeTrail = (trail: Trail) => {
  try {
    sessionStorage.setItem(TRAIL_KEY, JSON.stringify(trail));
  } catch {
    // private mode: "up" then always replaces instead of stepping back
  }
};

// the entry the app was loaded on is not numbered by the router; it is the
// first one, so it counts as 0
const currentIndex = () => {
  const idx = (window.history.state as { idx?: unknown } | null)?.idx;
  return Number.isInteger(idx) ? (idx as number) : 0;
};

/**
 * Records the path of every history entry. Mounted once, in the root layout.
 */
export const useNavigationTrail = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    const idx = currentIndex();

    const trail = readTrail();

    // a new entry drops everything that was ahead of it
    if (navigationType === 'PUSH') {
      for (const key of Object.keys(trail)) {
        if (!(Number(key) <= idx)) delete trail[key];
      }
    }

    trail[idx] = pathname;
    writeTrail(trail);
  }, [pathname, navigationType]);
};

/**
 * Moves one level up in the app's structure instead of blindly one step back
 * in history. It steps back when the previous entry already is that level,
 * so scroll and tabs are kept; otherwise (a reload, a shared link, a page
 * opened directly) it replaces the current entry, so back can never loop.
 */
const useUpNavigation = () => {
  const navigate = useNavigate();

  const goUp = useCallback(
    (target: string) => {
      const idx = currentIndex();
      const previous = idx > 0 ? readTrail()[idx - 1] : undefined;

      if (previous === target) {
        navigate(-1);
        return;
      }

      navigate(target, { replace: true });
    },
    [navigate]
  );

  return { goUp };
};

export default useUpNavigation;
