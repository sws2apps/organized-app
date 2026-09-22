import { useLocation } from 'react-router';

const WIDE_PAGES = ['/territories/map'];

const usePageWidth = () => {
  const { pathname } = useLocation();

  return WIDE_PAGES.includes(pathname) ? '1920px' : '1440px';
};

export default usePageWidth;
