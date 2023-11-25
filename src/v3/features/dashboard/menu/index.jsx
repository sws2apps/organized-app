import PropTypes from 'prop-types';
import { Box, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Typography } from '@components';

const DashboardMenu = ({ icon, primaryText = '', secondaryText = '', badgeText = '' }) => {
  return (
    <ListItemButton
      disableRipple
      sx={{
        padding: '12px 8px 12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        minHeight: '50px',
        '&:hover': {
          background: 'var(--accent-150)',
          '& .menu-secondary': {
            background: 'var(--accent-200)',
          },
        },
        '&:active': {
          background: 'var(--accent-200)',
          '& .menu-secondary': {
            background: 'var(--accent-300)',
          },
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 0 }}>{icon}</ListItemIcon>
      <ListItemText
        sx={{ marginTop: 0, marginBottom: 0 }}
        disableTypography
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body-regular" color="var(--black)">
                {primaryText}
              </Typography>
              {secondaryText.length > 0 && (
                <Typography variant="label-small-regular" color="var(--grey-350)">
                  {secondaryText}
                </Typography>
              )}
            </Box>
            {badgeText.length > 0 && (
              <Box
                className="menu-secondary"
                sx={{ padding: '4px 12px', borderRadius: 'var(--radius-xxl)', background: 'var(--accent-150)' }}
              >
                <Typography variant="body-small-semibold" color="var(--accent-dark)" sx={{ textAlign: 'center' }}>
                  {badgeText}
                </Typography>
              </Box>
            )}
          </Box>
        }
      />
    </ListItemButton>
  );
};

DashboardMenu.propTypes = {
  icon: PropTypes.element,
  primaryText: PropTypes.string,
  secondaryText: PropTypes.string,
  badgeText: PropTypes.string,
};

export default DashboardMenu;
