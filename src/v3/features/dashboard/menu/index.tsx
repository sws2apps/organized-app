import { ReactElement } from 'react';
import { Box, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Typography } from '@components';

const DashboardMenu = ({
  icon,
  primaryText = '',
  secondaryText = '',
  badgeText = '',
  onClick,
}: {
  icon: ReactElement;
  primaryText: string;
  secondaryText?: string;
  badgeText?: string;
  onClick?: VoidFunction;
}) => {
  return (
    <ListItemButton
      disableRipple
      onClick={onClick}
      sx={{
        padding: '8px 8px 8px 16px',
        minHeight: '40px',
        borderRadius: 'var(--radius-s)',
        transition: 'background 0.1s ease',
        '&:hover': {
          background: 'var(--accent-150)',
          '& p': {
            color: 'var(--accent-dark)',
          },
          '& svg, & svg g, & svg g path': {
            fill: 'var(--accent-dark)',
          },
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
      <Box sx={{ flex: '1 0 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <ListItemIcon sx={{ minWidth: 0 }}>{icon}</ListItemIcon>
        <ListItemText
          sx={{ marginTop: 0, marginBottom: 0 }}
          disableTypography
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography className="body-regular" color="var(--black)">
                  {primaryText}
                </Typography>
                {secondaryText.length > 0 && (
                  <Typography className="label-small-regular" color="var(--grey-350)">
                    {secondaryText}
                  </Typography>
                )}
              </Box>
              {badgeText.length > 0 && (
                <Box
                  className="menu-secondary"
                  sx={{ padding: '2px 12px', borderRadius: 'var(--radius-xxl)', background: 'var(--accent-150)' }}
                >
                  <Typography className="body-small-semibold" color="var(--accent-dark)" sx={{ textAlign: 'center' }}>
                    {badgeText}
                  </Typography>
                </Box>
              )}
            </Box>
          }
        />
      </Box>
    </ListItemButton>
  );
};

export default DashboardMenu;
