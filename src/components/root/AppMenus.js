import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import styled from "@emotion/styled";
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import GetApp from '@mui/icons-material/GetApp';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AppDrawer from "./AppDrawer";
import AppLanguage from "./AppLanguage";
import * as serviceWorkerRegistration from '../../serviceWorkerRegistration';
import { isAboutOpenState, isLoginOpenState, uidUserState } from '../../appStates/appSettings';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);
const drawerWidth = 240;

const AppMenus = (props) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [appBarTitle, setAppBarTitle] = useState('');
  const { enabledInstall, isLoading, installPwa } = props;

  const [uidUser, setUidUser] = useRecoilState(uidUserState);

  const setIsAboutOpen = useSetRecoilState(isAboutOpenState);
  const setIsLoginOpen = useSetRecoilState(isLoginOpenState);

  const { t } = useTranslation();

  const handleInstallPwa = () => {
    installPwa();
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleAbout = () => {
    setIsAboutOpen(true);
  }

  const handleLogin = () => {
    setIsLoginOpen(true);
  }

  const handleLogout = () => {
    setUidUser('');
  }

  useEffect(() => {
    if (location.pathname === "/") {
      setAppBarTitle(t("global.home"));
    } else if (location.pathname === "/Students") {
      setAppBarTitle(t("global.students"));
    } else if (location.pathname === "/Schedule") {
      setAppBarTitle(t("global.schedule"));
    } else if (location.pathname === "/SourceMaterial") {
      setAppBarTitle(t("global.sourceMaterial"));
    } else if (location.pathname === "/Settings") {
      setAppBarTitle(t("global.settings"));
    } else if (location.pathname === "/Administration") {
      setAppBarTitle(t("global.administration"));
    } else if (location.pathname === "/Help") {
      setAppBarTitle(t("global.help"));
    };
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    } else {
      serviceWorkerRegistration.update();
    }
  }, [t, location.pathname])

  return (
    <Box sx={{display: 'flex'}}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: '50px !important',
          minHeight: '50px !important',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Toolbar
          sx={{
            height: '50px !important',
            minHeight: '50px !important',
          }}
        >
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              '@media screen and (max-width: 959px)': {
                fontSize: 0,
                marginRight: '2px',
                display: 'block',
              },
              '@media screen and (min-width: 960px)': {
                display: 'none',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            <Box sx={{display: "flex"}}>
              <Box
                sx={{
                  '@media screen and (max-width: 959px)': {
                    display: 'none',
                  },
                  '@media screen and (min-width: 960px)': {
                    marginRight: '3px',
                    display: 'block',
                  },
                }}
              >
                LMM-OA |
              </Box>
              {appBarTitle}
            </Box>
          </Typography>
        </Toolbar>
        <Box
          sx={{
            minWidth: '30px',
            flex: 'none'
          }}
        >
          {(!isLoading && enabledInstall) && (
            <IconButton
              color="inherit"
              edge="start"
              sx={{marginRight: '8px'}}
              onClick={() => handleInstallPwa()}
            >
              <GetApp />
            </IconButton>
          )}
          <AppLanguage />
          {navigator.onLine && (
            <>
              {uidUser.length === 0 && (
                <Tooltip title={t("global.login")}>
                  <IconButton
                    color="inherit"
                    edge="start"
                    sx={{marginRight: '8px'}}
                    onClick={handleLogin}
                  >
                    <LoginIcon />
                  </IconButton>
                </Tooltip>
              )}
              {uidUser.length > 0 && (
                <Tooltip title={t("global.logout")}>
                  <IconButton
                    color="inherit"
                    edge="start"
                    sx={{marginRight: '8px'}}
                    onClick={handleLogout}
                  >
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => handleAbout()}
          >
            <InfoIcon />
          </IconButton>
        </Box>
      </AppBar>
      
      <Box
        component="nav"
        sx={{
          '@media screen and (min-width: 960px)': {
            width: drawerWidth,
            flexShrink: 0,
          },
        }}
      >
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          onClick={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 2,
            '@media screen and (max-width: 959px)': {
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              display: 'block',
            },
            '@media screen and (min-width: 960px)': {
              display: 'none',
            },
          }}
        >
          <Typography
            variant="h6"
            noWrap
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              backgroundColor: '#3f51b5',
              height: 50,
            }}
          >
            LMM-OA
          </Typography>
          <AppDrawer />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            '@media screen and (min-width: 960px)': {
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              display: 'block',
            },
            '@media screen and (max-width: 959px)': {
              display: 'none',
            },
          }}
        >
          <Offset />
          <AppDrawer />
        </Drawer>  
      </Box>
    </Box>
  );
}
 
export default AppMenus;