import { useMediaQuery, useTheme } from '@mui/material';

const useBreakpoints = () => {
  const theme = useTheme();

  const mobile400Down = useMediaQuery(theme.breakpoints.down('mobile400'), {
    noSsr: true,
  });

  const tablet500Down = useMediaQuery(theme.breakpoints.down('tablet500'), {
    noSsr: true,
  });

  const tablet600Up = useMediaQuery(theme.breakpoints.up('tablet600'), {
    noSsr: true,
  });

  const tablet600Down = useMediaQuery(theme.breakpoints.down('tablet600'), {
    noSsr: true,
  });

  const tabletUp = useMediaQuery(theme.breakpoints.up('tablet'), {
    noSsr: true,
  });

  const tabletDown = useMediaQuery(theme.breakpoints.down('tablet'), {
    noSsr: true,
  });

  const laptopDown = useMediaQuery(theme.breakpoints.down('laptop'), {
    noSsr: true,
  });

  const laptopUp = useMediaQuery(theme.breakpoints.up('laptop'), {
    noSsr: true,
  });

  const desktopUp = useMediaQuery(theme.breakpoints.up('desktop'), {
    noSsr: true,
  });

  return {
    mobile400Down,
    tablet500Down,
    tablet600Up,
    tablet600Down,
    tabletUp,
    tabletDown,
    laptopDown,
    laptopUp,
    desktopUp,
  };
};

export default useBreakpoints;
