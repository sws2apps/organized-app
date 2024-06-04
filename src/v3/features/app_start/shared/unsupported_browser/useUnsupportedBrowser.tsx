import { useEffect, useRef } from 'react';

const useUnsupportedBrowser = () => {
  const anchorRef = useRef<HTMLElement>();

  const reloadApp = () => {
    window.location.reload();
  };

  useEffect(() => {
    const tryAgain = anchorRef.current;

    tryAgain?.addEventListener('click', reloadApp);

    return () => {
      if (tryAgain) tryAgain?.removeEventListener('click', reloadApp);
    };
  }, [reloadApp]);

  return { anchorRef, reloadApp };
};

export default useUnsupportedBrowser;
