import { useLocation } from 'react-router';

const WIDE_PAGES = new Set(['/territories/map']);

const usePageWidth = () => {
  const { pathname } = useLocation();

  return WIDE_PAGES.has(pathname) ? '1920px' : '1440px';
};

export default usePageWidth;
