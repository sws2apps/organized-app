import { Avatar, Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import {
  userAvatarTypeState,
  userAvatarUrlState,
  firstnameState,
  lastnameState,
} from '@states/settings';
import { AvatarType } from '@definition/settings';
import { IconHeaderAccount } from '@icons/index';
import * as AvatarUrls from '@components/profile_avatars';
import Typography from '@components/typography';

const AvatarMap: Record<AvatarType, string> = AvatarUrls as Record<AvatarType, string>;

type ProfilePictureProps = {
  size?: number;
  typeOverride?: AvatarType;
  alt?: string;
};

const ProfilePicture = ({ size = 24, typeOverride, alt = 'Avatar' }: ProfilePictureProps) => {
  const selectedAvatarType = useAtomValue(userAvatarTypeState);
  const avatarUrl = useAtomValue(userAvatarUrlState);
  const firstName = useAtomValue(firstnameState);
  const lastName = useAtomValue(lastnameState);

  const avatarType = typeOverride || selectedAvatarType;

  const getInitials = () => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${first}${last}` || 'A';
  };

  const renderContent = () => {
    // Google/OAuth avatar
    if (avatarType === 'google' && avatarUrl) {
      return (
        <Avatar
          alt={alt}
          src={avatarUrl}
          sx={{ width: '100%', height: '100%' }}
        />
      );
    }

    // Initials avatar
    if (avatarType === 'initials') {
      return (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{
              color: 'var(--always-white)',
              fontSize: `${size * 0.4}px`,
              fontWeight: 600,
            }}
          >
            {getInitials()}
          </Typography>
        </Box>
      );
    }

    // Custom SVG avatar (gradient, abstract, story, person)
    if (avatarType && avatarType !== 'default' && avatarType !== 'google') {
      const url = AvatarMap[avatarType];
      if (url) {
        return (
          <img
            src={url}
            alt={alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
            }}
          />
        );
      }
    }

    // Default: standard profile icon linked to accent color
    return (
      <IconHeaderAccount
        width={size}
        height={size}
        color="var(--accent-main)"
      />
    );
  };

  return (
    <Box
      sx={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {renderContent()}
    </Box>
  );
};

export default ProfilePicture;
