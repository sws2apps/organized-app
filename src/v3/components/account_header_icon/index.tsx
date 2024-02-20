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
          sx={{ width: 32, height: 32, border: isOffline ? '2px solid var(--red-main)' : 'none' }}
        />
      )}
      {!userAvatar && (
        <IconHeaderAccount
          width={32}
          height={32}
          color="#5065D0"
          sx={{ border: isOffline ? '2px solid var(--red-main)' : 'none', borderRadius: 'var(--radius-xxl)' }}
        />
      )}
      {isOffline && (
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

export default AccountHeaderIcon;
