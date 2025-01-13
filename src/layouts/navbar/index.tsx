import {
  AppBar,
  Box,
  Container,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
} from '@mui/material';
import {
  IconAccount,
  IconDonate,
  IconHelp,
  IconInfo,
  IconLogin,
  IconLogo,
  IconMail,
  IconArrowLink,
} from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import { isDemo } from '@constants/index';
import { NavBarType } from './index.types';
import useNavbar from './useNavbar';
import AccountHeaderIcon from '@components/account_header_icon';
import AppNotification from '@features/app_notification';
import Button from '@components/button';
import DemoBanner from '@features/demo/banner';
import LanguageSwitcher from '@features/language_switcher';
import ThemeSwitcher from '@features/theme_switcher';
import Typography from '@components/typography';

const baseMenuStyle = {
  padding: '8px 12px 8px 16px',
  minHeight: '40px',
  height: '40px',
  gap: '8px',
};

const menuStyle = {
  ...baseMenuStyle,
  '&:hover': {
    backgroundColor: 'var(--accent-100)',
    '& p': {
      color: 'var(--accent-main)',
    },
    '& svg, & svg g, & svg g path': {
      fill: 'var(--accent-main)',
    },
  },
};

const NavBar = ({ isSupported }: NavBarType) => {
  const { t } = useAppTranslation();

  const {
    anchorEl,
    handleCloseMore,
    handleOpenMoreMenu,
    openMore,
    handleOpenContact,
    handleOpenAbout,
    handleOpenSupport,
    handleOpenDoc,
    fullname,
    congName,
    tabletUp,
    laptopUp,
    tabletDown,
    isCongAccountConnected,
    handleOpenMyProfile,
    handleGoDashboard,
    isAppLoad,
    handleReconnectAccount,
    handleOpenRealApp,
    accountType,
  } = useNavbar();

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'var(--accent-100)',
        borderBottom: '1px solid var(--accent-200)',
        minHeight: '56px',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        overflow: 'hidden',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ padding: 0 }}>
        <Container
          maxWidth={false}
          sx={{
            maxWidth: '1440px',
            padding: { mobile: '8px 16px', tablet: '8px 32px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: { mobile: '8px', tablet: '16px' },
            }}
            onClick={handleGoDashboard}
          >
            <IconLogo width={40} height={40} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <Typography className="h3" color="var(--black)">
                Organized
              </Typography>
              {isDemo && <DemoBanner />}
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { mobile: '4px', tablet: '8px' },
            }}
          >
            {isSupported && <AppNotification />}

            <ThemeSwitcher />

            {tabletUp && (isAppLoad || isDemo) && (
              <LanguageSwitcher
                menuStyle={{
                  ...baseMenuStyle,
                  '&:hover': {
                    backgroundColor: 'var(--accent-200)',
                    borderRadius: 'var(--radius-l)',
                  },
                }}
              />
            )}

            {isSupported && (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginLeft: !tabletUp ? '4px' : '0px',
                  }}
                >
                  {laptopUp && fullname && congName && (
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                      }}
                    >
                      <Typography
                        className="body-small-semibold"
                        sx={{ textAlign: 'right' }}
                      >
                        {fullname}
                      </Typography>
                      <Typography
                        className="label-small-regular"
                        sx={{ textAlign: 'right' }}
                      >
                        {congName}
                      </Typography>
                    </Box>
                  )}
                  <AccountHeaderIcon
                    handleOpenMore={handleOpenMoreMenu}
                    isMoreOpen={openMore}
                  />
                </Box>

                <Menu
                  id="menu-language"
                  disableScrollLock={true}
                  anchorEl={anchorEl}
                  open={openMore}
                  onClose={handleCloseMore}
                  sx={{
                    padding: '8px 0',
                    marginTop: '7px',
                    '& li': {
                      borderBottom: '1px solid var(--accent-200)',
                    },
                    '& li:last-child': {
                      borderBottom: 'none',
                    },
                  }}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                  slotProps={{
                    paper: {
                      className: 'small-card-shadow',
                      style: {
                        borderRadius: 'var(--radius-l)',
                        border: '1px solid var(--accent-200)',
                        backgroundColor: 'var(--white)',
                        minWidth: '294px',
                      },
                    },
                  }}
                >
                  {(tabletDown || (!isAppLoad && !isDemo)) && (
                    <LanguageSwitcher menuStyle={menuStyle} />
                  )}

                  {!isAppLoad && (
                    <MenuItem
                      disableRipple
                      sx={menuStyle}
                      onClick={handleOpenMyProfile}
                    >
                      <ListItemIcon
                        sx={{
                          '&.MuiListItemIcon-root': {
                            width: '24px',
                            minWidth: '24px !important',
                          },
                        }}
                      >
                        <IconAccount color="var(--black)" />
                      </ListItemIcon>
                      <ListItemText>
                        <Typography className="body-regular">
                          {t('tr_myProfile')}
                        </Typography>
                      </ListItemText>
                    </MenuItem>
                  )}

                  {!isDemo && !isAppLoad && !isCongAccountConnected && (
                    <MenuItem
                      disableRipple
                      sx={menuStyle}
                      onClick={handleReconnectAccount}
                    >
                      <ListItemIcon
                        sx={{
                          '&.MuiListItemIcon-root': {
                            width: '24px',
                            minWidth: '24px !important',
                          },
                        }}
                      >
                        <IconLogin color="var(--black)" />
                      </ListItemIcon>
                      <ListItemText>
                        <Typography className="body-regular">
                          {t('tr_reconnectAccount')}
                        </Typography>
                      </ListItemText>
                    </MenuItem>
                  )}
                  <MenuItem
                    disableRipple
                    sx={menuStyle}
                    onClick={handleOpenSupport}
                  >
                    <ListItemIcon
                      sx={{
                        '&.MuiListItemIcon-root': {
                          width: '24px',
                          minWidth: '24px !important',
                        },
                      }}
                    >
                      <IconDonate color="var(--black)" />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography className="body-regular">
                        {t('tr_supportApp')}
                      </Typography>
                    </ListItemText>
                  </MenuItem>
                  <MenuItem
                    disableRipple
                    sx={menuStyle}
                    onClick={handleOpenDoc}
                  >
                    <ListItemIcon
                      sx={{
                        '&.MuiListItemIcon-root': {
                          width: '24px',
                          minWidth: '24px !important',
                        },
                      }}
                    >
                      <IconHelp color="var(--black)" />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography className="body-regular">
                        {t('tr_howToUseApp')}
                      </Typography>
                    </ListItemText>
                  </MenuItem>

                  {accountType === 'vip' && isCongAccountConnected && (
                    <MenuItem
                      disableRipple
                      sx={menuStyle}
                      onClick={handleOpenContact}
                    >
                      <ListItemIcon
                        sx={{
                          '&.MuiListItemIcon-root': {
                            width: '24px',
                            minWidth: '24px !important',
                          },
                        }}
                      >
                        <IconMail color="var(--black)" />
                      </ListItemIcon>
                      <ListItemText>
                        <Typography className="body-regular">
                          {t('tr_shareFeeback')}
                        </Typography>
                      </ListItemText>
                    </MenuItem>
                  )}

                  <MenuItem
                    disableRipple
                    sx={menuStyle}
                    onClick={handleOpenAbout}
                  >
                    <ListItemIcon
                      sx={{
                        '&.MuiListItemIcon-root': {
                          width: '24px',
                          minWidth: '24px !important',
                        },
                      }}
                    >
                      <IconInfo color="var(--black)" />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography className="body-regular">
                        {t('tr_about')}
                      </Typography>
                    </ListItemText>
                  </MenuItem>
                  {isDemo && (
                    <MenuItem
                      disableRipple
                      sx={{ ...menuStyle, height: 'auto', paddingTop: '5px' }}
                      onClick={handleOpenRealApp}
                    >
                      <Button
                        variant="tertiary"
                        startIcon={<IconArrowLink />}
                        sx={{ width: '100%' }}
                      >
                        {t('tr_openRealApp')}
                      </Button>
                    </MenuItem>
                  )}
                </Menu>
              </>
            )}
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
