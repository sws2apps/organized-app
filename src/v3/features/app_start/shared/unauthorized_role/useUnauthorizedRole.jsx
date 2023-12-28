import { useEffect, useRef } from 'react';

const useUnauthorizedRole = () => {
  const anchorRef = useRef();

  const reloadApp = () => {
    window.location.reload();
  };

  useEffect(() => {
    const tryAgain = anchorRef.current;

    tryAgain?.addEventListener('click', reloadApp);

    return () => {
      if (tryAgain) tryAgain?.removeEventListener('click', reloadApp);
    };
  }, [anchorRef]);

  return { anchorRef };
};

export default useUnauthorizedRole;
