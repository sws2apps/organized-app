import { isDarkThemeState } from '@states/app';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';

const useAppTheme = () => {
  const isDark = useAtomValue(isDarkThemeState);

  const [theme, setTheme] = useState(() => {
    return document.documentElement.getAttribute('data-theme');
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  const themeColor = useMemo(() => theme.split('-')[0], [theme]);

  const darkValue = isDark ? 'dark' : 'light';

  return {
    theme,
    themeColor,
    darkValue,
  };
};

export default useAppTheme;
