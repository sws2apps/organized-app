import { Avatar, Box, SxProps, Theme } from '@mui/material';
import { IconExpand, IconHeaderAccount, IconNoConnection } from '@icons/index';
import { useAccountHeaderIcon } from './useAccountHeaderIcon';
import { isTest } from '@constants/index';

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
  sx,
}: {
  handleOpenMore?: (e: unknown) => void;
  isMoreOpen?: boolean;
  sx?: SxProps<Theme>;
}) => {
  const { userAvatar, isOffline } = useAccountHeaderIcon();

  const isRed = !isTest && isOffline;

  return (
    <Box
      role="button"
      tabIndex={0}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: '4px',
        borderRadius: 'var(--radius-max)',
        border: `1px solid ${isRed ? 'var(--red-main)' : 'var(--accent-200)'}`,
        backgroundColor: 'var(--accent-150)',
        padding: '6px 6px 6px 6px',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.3s, border-color 0.3s',

        '&:focus-visible': {
          outline: 'var(--accent-main) auto 1px',
        },

        '&:hover': {
          backgroundColor: 'var(--accent-200)',
          borderColor: isRed ? 'var(--red-main)' : 'var(--accent-300)',
        },
        ...sx,
      }}
      onClick={handleOpenMore}
      onKeyDown={(e) =>
        e.key === 'Enter' || e.key === ' ' ? handleOpenMore(e) : null
      }
    >
      <Box
        sx={{
          width: '28px',
          height: '28px',
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
              width: '28px',
              height: '28px',
            }}
          />
        ) : (
          <IconHeaderAccount
            width={28}
            height={28}
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
            <IconNoConnection
              color="var(--always-white)"
              width={12}
              height={12}
            />
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
