import { Avatar, Box } from '@mui/material';
import { IconHeaderAccount, IconNoConnection } from '@icons/index';
import { useAccountHeaderIcon } from './useAccountHeaderIcon';

const AccountHeaderIcon = () => {
  const { userAvatar, isOffline } = useAccountHeaderIcon();

  return (
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {userAvatar && (
        <Avatar
          alt="Avatar"
          src={userAvatar}
          sx={{
            width: 32,
            height: 32,
            border: isOffline ? '2px solid var(--red-main)' : 'none',
            boxSizing: 'border-box',
          }}
        />
      )}
      {!userAvatar && (
        <IconHeaderAccount
          width={32}
          height={32}
          color="#5065D0"
          sx={{
            border: isOffline ? '2px solid var(--red-main)' : 'none',
            borderRadius: 'var(--radius-xxl)',
            boxSizing: 'border-box',
          }}
        />
      )}
      {isOffline && (
        <IconNoConnection
          width={16}
          height={16}
          color="#FEFEFE"
          sx={{
            position: 'absolute',
            background: 'var(--red-main)',
            borderRadius: 'var(--radius-xxl)',
            padding: '2px',
            top: '20px',
            left: '-2px',
          }}
        />
      )}
    </Box>
  );
};

export default AccountHeaderIcon;
