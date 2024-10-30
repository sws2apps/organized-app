import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Typography from '@components/typography';

const DashboardMenu = ({
  icon,
  primaryText = '',
  secondaryText = '',
  badgeText = '',
  hoverColor = '',
  accentHoverColor = '',
  activeColor = '',
  onClick,
  path,
  actionComponent,
  height,
  small = false,
}: {
  icon: ReactElement;
  primaryText: string;
  secondaryText?: string;
  badgeText?: string;
  hoverColor?: string;
  accentHoverColor?: string;
  activeColor?: string;
  onClick?: VoidFunction;
  path?: string;
  actionComponent?: ReactElement;
  height?: string;
  small?: boolean;
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (path) {
      navigate(path);
      return;
    }

    onClick?.();
  };

  return (
    <ListItemButton
      disableRipple
      onClick={handleClick}
      sx={{
        padding: small ? '4px 4px 4px 8px' : '8px 8px 8px 16px',
        height: '100%',
        // height: height ? height : '100%',
        minHeight: height ? height : '40px',
        borderRadius: 'var(--radius-s)',
        transition: 'background 0.1s ease',
        '&:hover': {
          background: hoverColor ? hoverColor : 'var(--accent-150)',
          '& p': {
            color: accentHoverColor ? accentHoverColor : 'var(--accent-dark)',
          },
          '& svg, & svg g, & svg g path': {
            fill: accentHoverColor ? accentHoverColor : 'var(--accent-dark)',
          },
          '& .menu-secondary': {
            background: 'var(--accent-200)',
          },
        },
        '&:active': {
          background: activeColor ? activeColor : 'var(--accent-200)',
          '& .menu-secondary': {
            background: 'var(--accent-300)',
          },
        },
      }}
    >
      <Box
        sx={{
          flex: '1 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <ListItemIcon sx={{ minWidth: 0 }}>{icon}</ListItemIcon>
        <ListItemText
          sx={{ marginTop: 0, marginBottom: 0 }}
          disableTypography
          primary={
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Typography className="body-regular" color="var(--black)">
                  {primaryText}
                </Typography>
                {secondaryText.length > 0 && (
                  <Typography
                    className="label-small-regular"
                    color="var(--grey-350)"
                  >
                    {secondaryText}
                  </Typography>
                )}
              </Box>
              {actionComponent ? actionComponent : null}
              {badgeText.length > 0 && (
                <Box
                  className="menu-secondary"
                  sx={{
                    padding: '2px 12px',
                    borderRadius: 'var(--radius-xxl)',
                    background: 'var(--accent-150)',
                  }}
                >
                  <Typography
                    className="body-small-semibold"
                    color="var(--accent-dark)"
                    sx={{ textAlign: 'center' }}
                  >
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
