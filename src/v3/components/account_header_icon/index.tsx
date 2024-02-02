import { Avatar, Box } from '@mui/material';
import { IconHeaderAccount, IconNoConnection } from '@icons';
import { useAccountHeaderIcon } from './useAccountHeaderIcon';

export const AccountHeaderIcon = () => {
  const { userAvatar, isOnline } = useAccountHeaderIcon();

  return (
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {userAvatar && (
        <Avatar
          alt="Avatar"
          src={userAvatar}
          sx={{ width: 32, height: 32, border: isOnline ? 'none' : '2px solid var(--red-main)' }}
        />
      )}
      {!userAvatar && (
        <IconHeaderAccount
          width={32}
          height={32}
          color="#5065D0"
          sx={{ border: isOnline ? 'none' : '2px solid var(--red-main)', borderRadius: 'var(--radius-xxl)' }}
        />
      )}
      {!isOnline && (
        <IconNoConnection
          width={12}
          height={12}
          color="#FEFEFE"
          sx={{
            position: 'absolute',
            background: 'var(--red-main)',
            borderRadius: 'var(--radius-xxl)',
            padding: '2px',
            top: '22px',
            left: '-2px',
          }}
        />
      )}
    </Box>
  );
};
