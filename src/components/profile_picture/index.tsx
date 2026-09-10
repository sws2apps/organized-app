import { Avatar, Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import {
  userAvatarTypeState,
  userAvatarUrlState,
  userInitialsState,
} from '@states/settings';
import { AvatarType } from '@definition/settings';
import {
  AVATAR_ICONS,
  AVATAR_IMAGES,
  GenericProfileComponent,
  isAvatarIcon,
  isAvatarImage,
} from '@components/profile_avatars';
import Typography from '@components/typography';

type ProfilePictureProps = {
  /** Rendered size in pixels. */
  size?: number;
  /** Renders the given avatar instead of the one saved by the user. */
  type?: AvatarType;
  alt?: string;
};

/**
 * Renders the avatar of the user: the photo from the linked account, the user
 * initials, one of the bundled illustrations, or the generic silhouette.
 *
 * Passing `type` renders that avatar instead of the saved one, which is how
 * the profile picture selector previews each option.
 */
const ProfilePicture = ({
  size = 24,
  type,
  alt = 'Avatar',
}: ProfilePictureProps) => {
  const savedType = useAtomValue(userAvatarTypeState);
  const avatarUrl = useAtomValue(userAvatarUrlState);
  const initials = useAtomValue(userInitialsState);

  const avatarType = type ?? savedType;

  const renderAvatar = () => {
    if (avatarType === 'google' && avatarUrl.length > 0) {
      return (
        <Avatar
          alt={alt}
          src={avatarUrl}
          sx={{ width: '100%', height: '100%' }}
        />
      );
    }

    if (avatarType === 'initials') {
      return (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: 'var(--radius-max)',
            backgroundColor: 'var(--accent-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            className="h2"
            sx={{
              color: 'var(--always-white)',
              fontSize: `${Math.round(size * 0.4)}px`,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {initials.length > 0 ? initials : 'A'}
          </Typography>
        </Box>
      );
    }

    if (isAvatarIcon(avatarType)) {
      const AvatarIcon = AVATAR_ICONS[avatarType];

      return (
        <AvatarIcon
          width={size}
          height={size}
          style={{ color: 'var(--accent-main)', display: 'block' }}
        />
      );
    }

    if (isAvatarImage(avatarType)) {
      return (
        <img
          src={AVATAR_IMAGES[avatarType]}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 'var(--radius-max)',
          }}
        />
      );
    }

    return (
      <GenericProfileComponent
        width={size}
        height={size}
        style={{ color: 'var(--accent-main)', display: 'block' }}
      />
    );
  };

  return (
    <Box
      sx={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: 'var(--radius-max)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {renderAvatar()}
    </Box>
  );
};

export default ProfilePicture;
