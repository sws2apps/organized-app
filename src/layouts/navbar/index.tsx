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
  IconLogout,
  IconArrowBack,
  IconSettings,
} from '@icons/index';
import { useAppTranslation, useFirebaseAuth } from '@hooks/index';
import { APP_ENVIRONMENT, isTest } from '@constants/index';
import { NavBarType } from './index.types';
import useNavbar from './useNavbar';
import AccountHeaderIcon from '@components/account_header_icon';
import AppNotification from '@features/app_notification';
import Button from '@components/button';
import DemoBanner from '@features/demo/banner';
import LanguageSwitcher from '@features/language_switcher';
import ThemeSwitcher from '@features/theme_switcher';
import Typography from '@components/typography';
import IconButton from '@components/icon_button';
import BottomMenu from '@layouts/bottom_menu';

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

  const { isAuthenticated } = useFirebaseAuth();

  const {
    anchorEl,
    handleCloseMore,
    handleOpenMoreMenu,
    openMore,
    handleOpenContact,
    handleOpenAbout,
    handleOpenSupport,
    handleOpenDoc,
    tabletUp,
    tabletDown,
    isCongAccountConnected,
    handleOpenMyProfile,
    handleGoDashboard,
    isAppLoad,
    handleReconnectAccount,
    handleOpenRealApp,
    handleBack,
    accountType,
    handleDisonnectAccount,
    congName,
    fullname,
    navBarOptions,
    handleQuickSettings,
    desktopUp,
  } = useNavbar();

  return (
    <>
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
              padding:
                navBarOptions.title !== null
                  ? { mobile: '4px 16px', tablet: '4px 32px' }
                  : { mobile: '8px 16px', tablet: '8px 32px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {!navBarOptions.title && !navBarOptions.buttons ? (
              <>
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
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    <Typography className="h3" color="var(--black)">
                      Organized
                    </Typography>
                    {APP_ENVIRONMENT && (
                      <DemoBanner environment={APP_ENVIRONMENT} />
                    )}
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

                  {tabletUp && (isAppLoad || isTest) && (
                    <LanguageSwitcher
                      menuStyle={{
                        ...baseMenuStyle,
                        '&:hover': {
                          backgroundColor: 'var(--accent-200)',
                          borderRadius: 'var(--radius-l)',
                        },
                        '&:focus-visible': {
                          outline: 'var(--accent-main) auto 1px',
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
                        <AccountHeaderIcon
                          handleOpenMore={handleOpenMoreMenu}
                          isMoreOpen={openMore}
                        />
                      </Box>

                      <Menu
                        disableAutoFocus={true}
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
                        slotProps={{
                          list: {
                            'aria-labelledby': 'basic-button',
                          },
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
                        <MenuItem
                          disableRipple
                          sx={{
                            cursor: 'default',
                            pointerEvents: 'none',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: 0,
                          }}
                        >
                          {fullname && (
                            <Typography className="body-small-semibold">
                              {fullname}
                            </Typography>
                          )}
                          {congName && (
                            <Typography
                              className="label-small-regular"
                              color="var(--grey-350)"
                            >
                              {congName}
                            </Typography>
                          )}
                        </MenuItem>

                        {(tabletDown || (!isAppLoad && !isTest)) && (
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

                        {isTest && (
                          <MenuItem
                            disableRipple
                            sx={{
                              ...menuStyle,
                              height: 'auto',
                              paddingTop: '5px',
                            }}
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

                        {!isTest &&
                          !isAppLoad &&
                          !isCongAccountConnected &&
                          accountType === 'vip' && (
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

                        {isAuthenticated && (
                          <MenuItem
                            disableRipple
                            sx={menuStyle}
                            onClick={handleDisonnectAccount}
                          >
                            <ListItemIcon
                              sx={{
                                '&.MuiListItemIcon-root': {
                                  width: '24px',
                                  minWidth: '24px !important',
                                },
                              }}
                            >
                              <IconLogout color="var(--black)" />
                            </ListItemIcon>
                            <ListItemText>
                              <Typography className="body-regular">
                                {t('tr_disconnectAccount')}
                              </Typography>
                            </ListItemText>
                          </MenuItem>
                        )}
                      </Menu>
                    </>
                  )}
                </Box>
              </>
            ) : (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: { mobile: '8px', tablet: '16px' },
                    alignItems: 'center',
                    width: !desktopUp ? '100%' : 'auto',
                    justifyContent: !desktopUp ? 'space-between' : 'start',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',

                      '&:focus-visible': {
                        outline: 'var(--accent-main) auto 1px',
                      },
                    }}
                    tabIndex={0}
                    onClick={handleBack}
                  >
                    <IconArrowBack color="var(--black)" />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography
                      className="h3"
                      color="var(--black)"
                      sx={{
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                      }}
                    >
                      {navBarOptions.title}
                    </Typography>
                    <Typography
                      className="label-small-regular"
                      color="var(--accent-400)"
                      sx={{
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                      }}
                    >
                      {navBarOptions.secondaryTitle}
                    </Typography>
                  </Box>
                  {navBarOptions.quickSettings ? (
                    <IconButton onClick={handleQuickSettings}>
                      <IconSettings color="var(--black)" />
                    </IconButton>
                  ) : (
                    !desktopUp && <Box sx={{ width: '22px', height: '22px' }} />
                  )}
                </Box>
                {!!desktopUp && (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      padding: '4px',
                      flexDirection: 'row',
                      backgroundColor: 'var(--accent-150)',
                      borderRadius: 'var(--radius-l)',
                    }}
                  >
                    {navBarOptions.buttons}
                  </Box>
                )}
              </>
            )}
          </Container>
        </Toolbar>
      </AppBar>
      {navBarOptions.buttons && !desktopUp && (
        <BottomMenu buttons={navBarOptions.buttons} />
      )}
    </>
  );
};

export default NavBar;
