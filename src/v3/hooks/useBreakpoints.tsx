import { useMediaQuery, useTheme } from '@mui/material';

const useBreakpoints = () => {
  const theme = useTheme();

  const tablet600Up = useMediaQuery(theme.breakpoints.up('tablet600'), {
    noSsr: true,
  });

  const tabletUp = useMediaQuery(theme.breakpoints.up('tablet'), {
    noSsr: true,
  });

  const tabletDown = useMediaQuery(theme.breakpoints.down('tablet'), {
    noSsr: true,
  });

  const laptopUp = useMediaQuery(theme.breakpoints.up('laptop'), {
    noSsr: true,
  });

  const desktopUp = useMediaQuery(theme.breakpoints.up('desktop'), {
    noSsr: true,
  });

  return { tablet600Up, tabletUp, tabletDown, laptopUp, desktopUp };
};

export default useBreakpoints;
