import { useMediaQuery, useTheme } from '@mui/material';

const useNavbar = () => {
  const theme = useTheme();

  const tabletUp = useMediaQuery(theme.breakpoints.up('tablet600'), {
    noSsr: true,
  });

  return { tabletUp };
};

export default useNavbar;
