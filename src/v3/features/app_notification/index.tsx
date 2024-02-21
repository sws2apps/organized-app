import { IconNotifications } from '@icons/index';
import { Badge, IconButton } from '@mui/material';

const AppNotification = () => {
  return (
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
    >
      <Badge
        badgeContent={2}
        slotProps={{
          badge: {
            style: {
              backgroundColor: 'var(--accent-main)',
              color: 'white',
              textAlign: 'center',
              fontStyle: 'normal',
              fontWeight: 500,
              fontFamily: 'Inter',
              lineHeight: '12px',
              top: '4px',
              right: '4px',
            },
          },
        }}
      >
        <IconNotifications color="var(--black)" />
      </Badge>
    </IconButton>
  );
};

export default AppNotification;
