import { PropsWithChildren } from 'react';
import { Box } from '@mui/material';
import { useLocation, useMatches } from 'react-router';

/**
 * Component that fades a page in when the route changes.
 * @param {PropsWithChildren} props - Props for the PageTransition component.
 * @returns {JSX.Element} PageTransition component.
 */
const PageTransition = ({ children }: PropsWithChildren) => {
  const { pathname } = useLocation();
  const route = useMatches().at(-1);

  // a route whose params only switch views keeps its page and keyboard focus
  const keepMounted = (route?.handle as { keepMounted?: boolean } | undefined)
    ?.keepMounted;
  const transitionKey = keepMounted && route ? route.id : pathname;

  return (
    <Box key={transitionKey} className="page-transition">
      {children}
    </Box>
  );
};

export default PageTransition;
