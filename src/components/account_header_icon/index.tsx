import { Avatar, Box } from '@mui/material';
import { IconHeaderAccount, IconNoConnection } from '@icons/index';
import { useAccountHeaderIcon } from './useAccountHeaderIcon';
import { isDemo } from '@constants/index';

/**
 * Functional component for rendering the user's avatar or a default icon
 * with an indicator for offline status.
 * @param {Object} props - Component props
 * @param {string} props.userAvatar - URL of the user's avatar
 * @param {boolean} props.isOffline - Indicator for user's offline status
 * @returns {JSX.Element} AccountHeaderIcon component
 */
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
            border: !isDemo && isOffline ? '2px solid var(--red-main)' : 'none',
            boxSizing: 'border-box',
          }}
        />
      )}
      {!userAvatar && (
        <>
          <Box
            sx={{
              border:
                !isDemo && isOffline ? '3px solid var(--red-main)' : 'none',
              borderRadius: '20px',
              boxSizing: 'border-box',
              height: '37px',
              width: '37px',
              zIndex: 2,
              left: '-3px',
              position: 'absolute',
            }}
          />
          <IconHeaderAccount
            width={32}
            height={32}
            color="var(--accent-main)"
            sx={{ zIndex: 1 }}
          />
        </>
      )}
      {isOffline && (
        <IconNoConnection
          width={16}
          height={16}
          color="#FEFEFE"
          sx={{
            position: 'absolute',
            background: 'var(--red-main)',
            borderRadius: '50%',
            padding: '2px',
            top: '20px',
            left: '-2px',
            zIndex: 3,
          }}
        />
      )}
    </Box>
  );
};

export default AccountHeaderIcon;
