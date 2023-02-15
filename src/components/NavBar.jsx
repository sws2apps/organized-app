import { cloneElement, useState } from 'react';
import { getAuth, signOut } from '@firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import useMediaQuery from '@mui/material/useMediaQuery';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import GetApp from '@mui/icons-material/GetApp';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import KeyIcon from '@mui/icons-material/Key';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import LogoutIcon from '@mui/icons-material/Logout';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AppLanguage from '../features/languageSwitcher';
import ThemeSwitcher from '../features/themeSwitcher';
import { themeOptionsState } from '../states/theme';
import {
  apiHostState,
  avatarUrlState,
  countNotificationsState,
  isAboutOpenState,
  isAppLoadState,
  isMyAssignmentOpenState,
  isOnlineState,
  isSetupState,
  isShowTermsUseState,
  isUserSignInState,
  isUserSignUpState,
  isWhatsNewOpenState,
  offlineOverrideState,
  visitorIDState,
} from '../states/main';
import { congAccountConnectedState, congInfoFormattedState, usernameState } from '../states/congregation';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';

const sharedStyles = {
  menuIcon: {
    borderRadius: '8px',
    '.MuiTouchRipple-ripple .MuiTouchRipple-child': {
      borderRadius: 0,
      backgroundColor: 'rgba(23, 32, 42, .3)',
    },
  },
};

const ElevationScroll = (props) => {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
};

const NavBar = (props) => {
  const { enabledInstall, isLoading, installPwa } = props;

  const { t } = useTranslation('ui');
  const navigate = useNavigate();
  const theme = useTheme();

  const [congAccountConnected, setCongAccountConnected] = useRecoilState(congAccountConnectedState);

  const setIsAboutOpen = useSetRecoilState(isAboutOpenState);
  const setOfflineOverride = useSetRecoilState(offlineOverrideState);
  const setIsAppLoad = useSetRecoilState(isAppLoadState);
  const setShowTermsUse = useSetRecoilState(isShowTermsUseState);
  const setUserSignIn = useSetRecoilState(isUserSignInState);
  const setUserSignUp = useSetRecoilState(isUserSignUpState);
  const setIsSetup = useSetRecoilState(isSetupState);
  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setWhatsNewOpen = useSetRecoilState(isWhatsNewOpenState);
  const setMyAssignmentOpen = useSetRecoilState(isMyAssignmentOpenState);

  const themeOptions = useRecoilValue(themeOptionsState);
  const cnNews = useRecoilValue(countNotificationsState);
  const congInfo = useRecoilValue(congInfoFormattedState);
  const username = useRecoilValue(usernameState);
  const isAppLoad = useRecoilValue(isAppLoadState);
  const isOnline = useRecoilValue(isOnlineState);
  const userAvatar = useRecoilValue(avatarUrlState);
  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);

  const mdUp = useMediaQuery(theme.breakpoints.up('md'), {
    noSsr: true,
  });
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'), {
    noSsr: true,
  });

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleWhatsNewClick = () => {
    setMyAssignmentOpen(false);
    setWhatsNewOpen(true);
  };

  const handleMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAbout = () => {
    handleClose();
    setIsAboutOpen(true);
  };

  const handleUseOnlineAccount = () => {
    handleClose();
    setShowTermsUse(false);
    setUserSignUp(false);
    setUserSignIn(true);
    setOfflineOverride(true);
    setIsAppLoad(true);
    setIsSetup(true);
  };

  const handleLogout = async () => {
    handleClose();
    if (apiHost !== '') {
      const auth = getAuth();
      const user = auth.currentUser;

      await fetch(`${apiHost}api/users/logout`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          visitorid: visitorID,
          uid: user.uid,
        },
      });

      await signOut(auth);

      setCongAccountConnected(false);

      setAppMessage(t('logoutSuccess'));
      setAppSeverity('success');
      setAppSnackOpen(true);
    }
  };

  const handleGoDashboard = () => {
    navigate('/');
  };

  const handleGoSettings = () => {
    handleClose();
    navigate('/user-settings');
  };

  return (
    <>
      <CssBaseline />
      <ElevationScroll {...props}>
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: themeOptions.mainColor,
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
                src="./img/appLogo.png"
                alt="App Logo"
                onClick={handleGoDashboard}
                style={{
                  width: 'auto',
                  height: '50px',
                  borderRadius: '4px',
                  marginRight: '5px',
                  cursor: 'pointer',
                }}
              />
              <Typography noWrap sx={{ fontSize: '18px' }}>
                {lgUp ? 'Congregation Program for Everyone' : 'CPE App'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <AppLanguage />

              {!isLoading && enabledInstall && (
                <IconButton color="inherit" edge="start" sx={sharedStyles.menuIcon} onClick={() => installPwa()}>
                  <GetApp />
                  {mdUp && <Typography sx={{ marginLeft: '5px' }}>{t('install')}</Typography>}
                </IconButton>
              )}

              <IconButton color="inherit" edge="start" sx={sharedStyles.menuIcon} onClick={handleWhatsNewClick}>
                <Badge badgeContent={cnNews} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <ThemeSwitcher />

              {!isAppLoad && (
                <>
                  <IconButton
                    color="inherit"
                    edge="start"
                    sx={sharedStyles.menuIcon}
                    onClick={handleMenu}
                    id="button-account"
                    aria-controls={open ? 'menu-account' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    {mdUp && (
                      <Box sx={{ marginRight: '5px' }}>
                        <Typography
                          sx={{
                            marginLeft: '5px',
                            textAlign: 'right',
                            fontSize: '12px',
                          }}
                        >
                          {username}
                        </Typography>
                        <Typography
                          sx={{
                            marginLeft: '5px',
                            textAlign: 'right',
                            fontSize: '12px',
                          }}
                        >
                          {congInfo}
                        </Typography>
                      </Box>
                    )}
                    {userAvatar && (
                      <Avatar alt="Avatar" src={userAvatar} sx={{ width: 32, height: 32, border: '1px solid white' }} />
                    )}
                    {!userAvatar && <AccountCircle sx={{ fontSize: '40px' }} />}
                  </IconButton>
                  <Menu
                    sx={{ marginTop: '40px', '.MuiMenu-list': { minWidth: '200px !important' } }}
                    id="menu-account"
                    MenuListProps={{
                      'aria-labelledby': 'button-account',
                    }}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    {isOnline && !congAccountConnected && (
                      <MenuItem onClick={handleUseOnlineAccount}>
                        <ListItemIcon>
                          <KeyIcon fontSize="medium" sx={{ color: '#DC7633' }} />
                        </ListItemIcon>
                        <ListItemText>{t('useOnlineAccount')}</ListItemText>
                      </MenuItem>
                    )}

                    {isOnline && congAccountConnected && (
                      <MenuItem onClick={handleGoSettings}>
                        <ListItemIcon>
                          <AdminPanelSettingsIcon fontSize="medium" color="primary" />
                        </ListItemIcon>
                        <ListItemText>{t('myUserProfile')}</ListItemText>
                      </MenuItem>
                    )}

                    <MenuItem onClick={handleAbout}>
                      <ListItemIcon>
                        <InfoIcon fontSize="medium" sx={{ color: '#3498DB' }} />
                      </ListItemIcon>
                      <ListItemText>{t('about')}</ListItemText>
                    </MenuItem>
                    {isOnline && congAccountConnected && (
                      <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                          <LogoutIcon fontSize="medium" sx={{ color: '#E74C3C' }} />
                        </ListItemIcon>
                        <ListItemText>{t('logoutOnlineAccount')}</ListItemText>
                      </MenuItem>
                    )}

                    {!mdUp && (
                      <MenuItem disabled={true} sx={{ opacity: '1 !important' }}>
                        <Box
                          sx={{
                            borderTop: '1px outset',
                            paddingTop: '5px',
                            width: '100%',
                            minWidth: '200px',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            flexDirection: 'column',
                          }}
                        >
                          <Typography
                            sx={{
                              marginLeft: '5px',
                              textAlign: 'right',
                              fontSize: '12px',
                            }}
                          >
                            {username}
                          </Typography>
                          <Typography
                            sx={{
                              marginLeft: '5px',
                              textAlign: 'right',
                              fontSize: '12px',
                            }}
                          >
                            {congInfo}
                          </Typography>
                        </Box>
                      </MenuItem>
                    )}
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
    </>
  );
};

export default NavBar;
