import { Avatar, Box } from '@mui/material';
import { IconExpand, IconHeaderAccount, IconNoConnection } from '@icons/index';
import { useAccountHeaderIcon } from './useAccountHeaderIcon';
import { isDemo } from '@constants/index';

/**
 * Functional component for rendering the user's avatar or a default icon
 * with an indicator for offline status. Additionally, it includes an expand icon
 * that rotates based on the `isMoreOpen` prop.
 *
 * @param {function} [props.handleOpenMore] - Event handler function for opening more options. Optional.
 * @param {boolean} [props.isMoreOpen=false] - Indicates whether the "more options" menu is open. Defaults to false.
 *
 * @returns {JSX.Element} The AccountHeaderIcon component.
 */
const AccountHeaderIcon = ({
  handleOpenMore,
  isMoreOpen = false,
}: {
  handleOpenMore?: (e: unknown) => void;
  isMoreOpen?: boolean;
}) => {
  const { userAvatar, isOffline } = useAccountHeaderIcon();

  const isRed = !isDemo && isOffline;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: '2px',
        borderRadius: 'var(--radius-max)',
        border: `1px solid ${isRed ? 'var(--red-main)' : 'var(--accent-200)'}`,
        backgroundColor: 'var(--accent-150)',
        padding: '4px 6px 4px 4px',
        alignItems: 'center',
        cursor: 'pointer',

        '&:hover': {
          backgroundColor: 'var(--accent-200)',
          borderColor: isRed ? 'var(--red-main)' : 'var(--accent-300)',
        },
      }}
      onClick={handleOpenMore}
    >
      <Box
        sx={{
          width: '24px',
          height: '24px',
          borderRadius: 'var(--radius-max)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {userAvatar ? (
          <Avatar
            alt="Avatar"
            src={userAvatar}
            sx={{
              width: '24px',
              height: '24px',
            }}
          />
        ) : (
          <IconHeaderAccount
            width={24}
            height={24}
            color="var(--accent-main)"
          />
        )}
        {isRed && (
          <Box
            sx={{
              width: '32px',
              height: '75%',
              position: 'absolute',
              bottom: '0',
              left: 'calc(50% - 16px)',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              background:
                'linear-gradient(180deg, rgba(202, 38, 38, 0) 0%, #CA2626 100%)',
            }}
          >
            <IconNoConnection color="var(--white)" width={12} height={12} />
          </Box>
        )}
      </Box>
      <IconExpand
        width={16}
        color="var(--accent-400)"
        sx={{
          transition: 'transform 0.3s',
          transform: isMoreOpen ? 'rotate(180deg)' : 'none',
        }}
      />
    </Box>
  );
};

export default AccountHeaderIcon;
