import { Box, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { DashboardMenuProps } from './index.types';
import useCurrentUser from '@hooks/useCurrentUser';
import Typography from '@components/typography';
import useMenu from './useMenu';

const DashboardMenu = (props: DashboardMenuProps) => {
  const { isGroup } = useCurrentUser();

  const badgeText = props.badgeText;
  const isNegativeBadge =
    typeof badgeText === 'string' && badgeText.trim().startsWith('-');

  const {
    handleClick,
    hoverBgColor,
    hoverTextColor,
    hoverMenuSecondaryBg,
    activeBgColor,
    activeMenuSecondaryBg,
  } = useMenu(props);

  return (
    <ListItemButton
      disableRipple
      onClick={handleClick}
      sx={{
        padding: props.small ? '4px 4px 4px 8px' : '8px 8px 8px 16px',
        height: '100%',
        minHeight: props.height ? props.height : '40px',
        borderRadius: 'var(--radius-s)',
        transition: 'background 0.1s ease',
        '&:hover': {
          background: hoverBgColor,
          '& p': {
            color: hoverTextColor,
          },
          '& svg, & svg g, & svg path': {
            fill: hoverTextColor,
          },
          '& .menu-secondary': {
            background: hoverMenuSecondaryBg,
          },
        },
        '&:active': {
          background: activeBgColor,
          '& .menu-secondary': {
            background: activeMenuSecondaryBg,
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
        <ListItemIcon sx={{ minWidth: 0 }}>{props.icon}</ListItemIcon>
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
                  {props.primaryText}
                </Typography>
                {props.secondaryText && props.secondaryText.length > 0 && (
                  <Typography
                    className="label-small-regular"
                    color="var(--grey-350)"
                  >
                    {props.secondaryText}
                  </Typography>
                )}
              </Box>
              {props.actionComponent ? props.actionComponent : null}
              {props.badgeText && props.badgeText.length > 0 && (
                <Box
                  className="menu-secondary"
                  sx={{
                    padding: '2px 12px',
                    borderRadius: 'var(--radius-xxl)',
                    background: isNegativeBadge
                      ? 'var(--red-secondary)'
                      : isGroup
                        ? 'var(--red-secondary)'
                        : 'var(--accent-150)',
                  }}
                >
                  <Typography
                    className="body-small-semibold"
                    color={
                      isNegativeBadge
                        ? 'var(--red-dark)'
                        : isGroup
                          ? 'var(--red-dark)'
                          : 'var(--accent-dark)'
                    }
                    sx={{ textAlign: 'center' }}
                  >
                    {props.badgeText}
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
