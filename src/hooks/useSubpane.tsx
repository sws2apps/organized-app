import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';

type SubpaneState = { subpane?: string } & Record<string, unknown>;

/**
 * Keeps a pane that stands in for a sub-page on smaller screens (such as the
 * filters of a list) in the URL, as `?<key>=1`.
 *
 * - Opened as a page, it gets its own history entry, so the device back
 *   gesture, the browser back button and the navbar back all close it.
 * - Opened as a side panel (desktop), it replaces the entry, so toggling a
 *   panel never piles up history.
 * - Closing steps back only when this entry was pushed by opening the pane;
 *   otherwise (a reload, a shared link) the flag is removed in place, so back
 *   can never loop between the list and its pane.
 */
const useSubpane = (key: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const open = searchParams.get(key) === '1';

  const state = useMemo(
    () => (location.state ?? {}) as SubpaneState,
    [location.state]
  );

  const withFlag = useCallback(
    (prev: URLSearchParams, on: boolean) => {
      const next = new URLSearchParams(prev);

      if (on) next.set(key, '1');
      else next.delete(key);

      return next;
    },
    [key]
  );

  const show = useCallback(
    (asPage = true) => {
      if (open) return;

      setSearchParams(
        (prev) => withFlag(prev, true),
        asPage
          ? { state: { ...state, subpane: key } }
          : { replace: true, state }
      );
    },
    [open, setSearchParams, withFlag, state, key]
  );

  const close = useCallback(() => {
    if (!open) return;

    if (state.subpane === key) {
      navigate(-1);
      return;
    }

    const rest = { ...state };
    delete rest.subpane;

    setSearchParams((prev) => withFlag(prev, false), {
      replace: true,
      state: rest,
    });
  }, [open, state, key, navigate, setSearchParams, withFlag]);

  const setOpen = useCallback(
    (next: boolean, asPage = true) => (next ? show(asPage) : close()),
    [show, close]
  );

  return useMemo(
    () => ({ open, show, close, setOpen }),
    [open, show, close, setOpen]
  );
};

export default useSubpane;
