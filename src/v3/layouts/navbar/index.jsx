import { Box, Container, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { Typography } from '@components';
import { AppNotification, LanguageSwitcher, ThemeSwitcher } from '@features/index';
import { IconDonate, IconHelp, IconInfo, IconLogo, IconMenu } from '@icons';
import { useAppTranslation } from '@hooks/index';
import useNavbar from './useNavbar';

const menuStyle = {
  padding: '8px 12px 8px 16px',
  minHeight: '40px',
  height: '40px',
  gap: '8px',
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

const NavBar = () => {
  const { t } = useAppTranslation();

  const {
    tabletUp,
    anchorEl,
    handleCloseMore,
    handleOpenMoreMenu,
    openMore,
    handleOpenAbout,
    handleOpenSupport,
    handleOpenDoc,
  } = useNavbar();

  return (
    <Box
      sx={{
        backgroundColor: 'var(--accent-100)',
        borderBottom: '1px solid var(--accent-200)',
        height: '56px',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        overflow: 'hidden',
        zIndex: 100,
      }}
    >
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { mobile: '8px', tablet: '16px' } }}>
          <IconLogo width={40} height={40} />
          <Typography variant="h3" color="var(--black)">
            {tabletUp ? t('appFullName') : t('appShortName')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { mobile: '0px', tablet: '8px' } }}>
          <ThemeSwitcher />
          <AppNotification />
          <LanguageSwitcher />
          <IconButton
            color="inherit"
            edge="start"
            sx={{
              padding: '8px',
              marginLeft: '0px',
              borderRadius: '8px',
              '.MuiTouchRipple-ripple .MuiTouchRipple-child': {
                borderRadius: 0,
                backgroundColor: 'rgba(23, 32, 42, .3)',
              },
            }}
            onClick={handleOpenMoreMenu}
          >
            <IconMenu color="var(--black)" />
          </IconButton>
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
            <MenuItem disableRipple sx={menuStyle} onClick={handleOpenSupport}>
              <ListItemIcon sx={{ '&.MuiListItemIcon-root': { width: '24px', minWidth: '24px' } }}>
                <IconDonate color="var(--black)" />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body-regular">{t('supportApp')}</Typography>
              </ListItemText>
            </MenuItem>
            <MenuItem disableRipple sx={menuStyle} onClick={handleOpenDoc}>
              <ListItemIcon sx={{ '&.MuiListItemIcon-root': { width: '24px', minWidth: '24px' } }}>
                <IconHelp color="var(--black)" />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body-regular">{t('howToUseApp')}</Typography>
              </ListItemText>
            </MenuItem>
            <MenuItem disableRipple sx={menuStyle} onClick={handleOpenAbout}>
              <ListItemIcon sx={{ '&.MuiListItemIcon-root': { width: '24px', minWidth: '24px' } }}>
                <IconInfo color="var(--black)" />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body-regular">{t('about')}</Typography>
              </ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Container>
    </Box>
  );
};

export default NavBar;
