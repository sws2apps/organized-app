import { PropsWithChildren } from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router';

/**
 * Component that fades a page in when the route changes.
 * @param {PropsWithChildren} props - Props for the PageTransition component.
 * @returns {JSX.Element} PageTransition component.
 */
const PageTransition = ({ children }: PropsWithChildren) => {
  const { pathname } = useLocation();

  return (
    <Box key={pathname} className="page-transition">
      {children}
    </Box>
  );
};

export default PageTransition;
