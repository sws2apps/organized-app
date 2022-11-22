import { cloneElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import useMediaQuery from '@mui/material/useMediaQuery';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Collapse from '@mui/material/Collapse';
import CssBaseline from '@mui/material/CssBaseline';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import GetApp from '@mui/icons-material/GetApp';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import KeyIcon from '@mui/icons-material/Key';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import Toolbar from '@mui/material/Toolbar';
import TopicIcon from '@mui/icons-material/Topic';
import Typography from '@mui/material/Typography';
import SettingsIcon from '@mui/icons-material/Settings';
import AppLanguage from '../features/languageSwitcher';
import ThemeSwitcher from '../features/themeSwitcher';
import { WhatsNewContent } from '../features/whatsNew';
import { themeOptionsState } from '../states/theme';
import {
  backupDbOpenState,
  countNotificationsState,
  isAboutOpenState,
  isAppClosingState,
  isAppLoadState,
  isOnlineState,
  isShowTermsUseState,
  isUserSignInState,
  isUserSignUpState,
  offlineOverrideState,
  restoreDbOpenState,
} from '../states/main';
import { congAccountConnectedState, congInfoFormattedState, usernameState } from '../states/congregation';

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

  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();

  const setIsAboutOpen = useSetRecoilState(isAboutOpenState);
  const setIsAppClosing = useSetRecoilState(isAppClosingState);
  const setIsBackupDb = useSetRecoilState(backupDbOpenState);
  const setIsRestoreDb = useSetRecoilState(restoreDbOpenState);
  const setOfflineOverride = useSetRecoilState(offlineOverrideState);
  const setIsAppLoad = useSetRecoilState(isAppLoadState);
  const setShowTermsUse = useSetRecoilState(isShowTermsUseState);
  const setUserSignIn = useSetRecoilState(isUserSignInState);
  const setUserSignUp = useSetRecoilState(isUserSignUpState);

  const themeOptions = useRecoilValue(themeOptionsState);
  const cnNews = useRecoilValue(countNotificationsState);
  const congInfo = useRecoilValue(congInfoFormattedState);
  const username = useRecoilValue(usernameState);
  const congAccountConnected = useRecoilValue(congAccountConnectedState);
  const isAppLoad = useRecoilValue(isAppLoadState);
  const isOnline = useRecoilValue(isOnlineState);

  const mdUp = useMediaQuery(theme.breakpoints.up('md'), {
    noSsr: true,
  });
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'), {
    noSsr: true,
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorPopoverEl, setAnchorPopoverEl] = useState(null);
  const [backupOpen, setBackupOpen] = useState(false);

  const open = Boolean(anchorEl);
  const openPopover = Boolean(anchorPopoverEl);
  const id = openPopover ? 'notification-popover' : undefined;

  const handleWhatsNewClick = (event) => {
    setAnchorPopoverEl(event.currentTarget);
  };

  const handleWhatsNewClose = () => {
    setAnchorPopoverEl(null);
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

  const handleLogout = async () => {
    handleClose();
    setIsAppClosing(true);
  };

  const handleUseOnlineAccount = () => {
    handleClose();
    setShowTermsUse(false);
    setUserSignUp(false);
    setUserSignIn(true);
    setOfflineOverride(true);
    setIsAppLoad(true);
  };

  const handleBackupClick = () => {
    setBackupOpen(!backupOpen);
  };

  const handleCreateBackup = () => {
    handleClose();
    setIsBackupDb(true);
  };

  const handleRestoreBackup = () => {
    handleClose();
    setIsRestoreDb(true);
  };

  const handleGoDashboard = () => {
    navigate('/');
  };

  const handleGoSettings = () => {
    handleClose();
    navigate('/settings');
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
                {lgUp ? 'Life and Ministry Meeting Overseer Assistant' : 'LMM-OA'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <AppLanguage />

              {!isLoading && enabledInstall && (
                <IconButton color="inherit" edge="start" sx={sharedStyles.menuIcon} onClick={() => installPwa()}>
                  <GetApp />
                  {mdUp && <Typography sx={{ marginLeft: '5px' }}>{t('global.install')}</Typography>}
                </IconButton>
              )}

              <IconButton
                color="inherit"
                edge="start"
                sx={sharedStyles.menuIcon}
                aria-describedby={id}
                onClick={handleWhatsNewClick}
              >
                <Badge badgeContent={cnNews} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <WhatsNewContent
                id={id}
                open={openPopover}
                anchorEl={anchorPopoverEl}
                handleClose={handleWhatsNewClose}
              />

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
                    <AccountCircle sx={{ fontSize: '40px' }} />
                  </IconButton>
                  <Menu
                    sx={{ marginTop: '40px' }}
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
                        <ListItemText>{t('global.useOnlineAccount')}</ListItemText>
                      </MenuItem>
                    )}

                    {isOnline && congAccountConnected && (
                      <MenuItem onClick={handleBackupClick} sx={{ width: '320px' }}>
                        <ListItemIcon>
                          <TopicIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('global.backup')} sx={{ marginRight: '10px' }} />
                        {backupOpen ? <ExpandLess /> : <ExpandMore />}
                      </MenuItem>
                    )}

                    <Collapse in={backupOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding sx={{ paddingLeft: '20px' }}>
                        <MenuItem onClick={handleCreateBackup}>
                          <ListItemIcon>
                            <CloudUploadIcon fontSize="medium" sx={{ color: '#2ECC71' }} />
                          </ListItemIcon>
                          <ListItemText>{t('global.sendBackup')}</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleRestoreBackup}>
                          <ListItemIcon>
                            <CloudDownloadIcon fontSize="medium" />
                          </ListItemIcon>
                          <ListItemText>{t('global.restoreBackup')}</ListItemText>
                        </MenuItem>
                      </List>
                    </Collapse>

                    <MenuItem onClick={handleGoSettings}>
                      <ListItemIcon>
                        <SettingsIcon fontSize="medium" color="error" />
                      </ListItemIcon>
                      <ListItemText>{t('global.settings')}</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleAbout}>
                      <ListItemIcon>
                        <InfoIcon fontSize="medium" sx={{ color: '#3498DB' }} />
                      </ListItemIcon>
                      <ListItemText>{t('global.about')}</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <PowerSettingsNewIcon fontSize="medium" sx={{ color: '#E74C3C' }} />
                      </ListItemIcon>
                      <ListItemText>{t('global.quit')}</ListItemText>
                    </MenuItem>
                    {!mdUp && (
                      <MenuItem disabled={true} sx={{ opacity: '1 !important' }}>
                        <Box
                          sx={{
                            borderTop: '1px outset',
                            paddingTop: '5px',
                            width: '280px',
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
