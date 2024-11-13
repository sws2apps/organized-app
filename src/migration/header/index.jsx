import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import imgLogo from '../img/appLogo.png';

const Header = () => {
  const theme = useTheme();

  const laptopUp = useMediaQuery(theme.breakpoints.up('laptop'), {
    noSsr: true,
  });

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#3f51b5 !important',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: '50px !important',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Toolbar
        sx={{
          height: '50px !important',
          paddingLeft: '0px !important',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginRight: '40px',
          }}
        >
          <img
            src={imgLogo}
            alt="App Logo"
            style={{
              width: 'auto',
              height: '50px',
              borderRadius: '4px',
              marginRight: '5px',
              cursor: 'pointer',
            }}
          />
          <Typography noWrap sx={{ fontSize: '18px' }}>
            {laptopUp ? 'Congregation Program for Everyone' : 'CPE'}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
