import { Box, SxProps, Theme } from '@mui/material';
import {
  IconCloudOff,
  IconCloudSync,
  IconExpand,
  IconInfo,
  IconNoConnection,
} from '@icons/index';
import { useAccountHeaderIcon } from './useAccountHeaderIcon';
import { isTest } from '@constants/index';
import ProfilePicture from '@components/profile_picture';
import { useAppTranslation } from '@hooks/index';

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
  const { status } = useAccountHeaderIcon();
  const { t } = useAppTranslation();

  // never colour alone: the state is also spoken
  const statusLabel: Record<string, string> = {
    connected: t('tr_statusConnected'),
    connecting: t('tr_statusConnecting'),
    paused: t('tr_offlineMode'),
    'no-network': t('tr_statusNoNetwork'),
    'server-unreachable': t('tr_cantReachServer'),
    attention: t('tr_statusAttention'),
  };

  // orange: offline mode the user chose; red: connection lost or action needed
  const badge = isTest || status === 'connected' ? null : status;

  const redBadge =
    'linear-gradient(180deg, rgba(202, 38, 38, 0) 0%, #CA2626 100%)';

  const badgeBackground: Record<string, string> = {
    attention: redBadge,
    'no-network': redBadge,
    'server-unreachable': redBadge,
    // stronger and higher than the others: the icon must read on any photo
    paused:
      'linear-gradient(180deg, rgba(221, 140, 44, 0) 0%, rgba(221, 140, 44, 0.9) 30%, var(--orange-main) 55%)',
    connecting:
      'linear-gradient(180deg, rgba(90, 96, 120, 0) 0%, var(--accent-main) 100%)',
  };

  const borderColor =
    badge === 'paused'
      ? 'var(--orange-main)'
      : badge && badge !== 'connecting'
        ? 'var(--red-main)'
        : undefined;

  const BadgeIcon =
    badge === 'paused'
      ? IconNoConnection
      : badge === 'no-network' || badge === 'server-unreachable'
        ? IconCloudOff
        : badge === 'connecting'
          ? IconCloudSync
          : IconInfo;

  return (
    <Box
      role="button"
      tabIndex={0}
      aria-label={statusLabel[status]}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: '4px',
        borderRadius: 'var(--radius-max)',
        border: `1px solid ${borderColor ?? 'var(--accent-200)'}`,
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
          borderColor: borderColor ?? 'var(--accent-300)',
        },
        ...sx,
      }}
      onClick={handleOpenMore}
      onKeyDown={(e) =>
        e.key === 'Enter' || e.key === ' ' ? handleOpenMore?.(e) : null
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
        <ProfilePicture size={28} />
        {badge && (
          <Box
            sx={{
              width: '32px',
              height: badge === 'paused' ? '90%' : '75%',
              position: 'absolute',
              bottom: '0',
              left: 'calc(50% - 16px)',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              background: badgeBackground[badge],
            }}
          >
            <BadgeIcon color="var(--always-white)" width={12} height={12} />
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
