import { useMemo } from 'react';
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

const AvatarMap: Record<AvatarType, string> = AvatarUrls as Record<
  AvatarType,
  string
>;

const ACCENT_ICON_TYPES = new Set<AvatarType>([
  'MaleIcon1',
  'MaleIcon2',
  'MaleIcon3',
  'FemaleIcon1',
  'FemaleIcon2',
  'FemaleIcon3',
]);

type ProfilePictureProps = {
  size?: number;
  typeOverride?: AvatarType;
  alt?: string;
};

const ProfilePictureGlobal = ({
  size,
  alt,
}: Pick<ProfilePictureProps, 'size' | 'alt'>) => {
  const avatarType = useAtomValue(userAvatarTypeState);
  const avatarUrl = useAtomValue(userAvatarUrlState);
  const firstName = useAtomValue(firstnameState);
  const lastName = useAtomValue(lastnameState);

  const initials =
    `${firstName?.charAt(0).toUpperCase() ?? ''}${lastName?.charAt(0).toUpperCase() ?? ''}` ||
    'A';

  return (
    <ProfilePictureContent
      size={size}
      alt={alt}
      avatarType={avatarType}
      avatarUrl={avatarUrl}
      initials={initials}
    />
  );
};

type ContentProps = {
  size: number;
  alt: string;
  avatarType: AvatarType;
  avatarUrl: string;
  initials: string;
};

const ProfilePictureContent = ({
  size,
  alt,
  avatarType,
  avatarUrl,
  initials,
}: ContentProps) => {
  const content = useMemo(() => {
    if (avatarType === 'google' && avatarUrl) {
      return (
        <Avatar alt={alt} src={avatarUrl} sx={{ width: '100%', height: '100%' }} />
      );
    }

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
            className="h2"
            sx={{
              color: 'var(--always-white)',
              fontSize: `${size * 0.4}px`,
              lineHeight: 1,
            }}
          >
            {initials}
          </Typography>
        </Box>
      );
    }

    if (avatarType && ACCENT_ICON_TYPES.has(avatarType)) {
      const url = AvatarMap[avatarType];
      if (url) {
        return (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'var(--accent-main)',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'var(--always-white)',
                WebkitMaskImage: `url(${url})`,
                maskImage: `url(${url})`,
                WebkitMaskSize: 'cover',
                maskSize: 'cover',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }}
            />
          </Box>
        );
      }
    }

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

    return (
      <IconHeaderAccount width={size} height={size} color="var(--accent-main)" />
    );
  }, [avatarType, avatarUrl, initials, size, alt]);

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
      {content}
    </Box>
  );
};

const ProfilePicture = ({
  size = 24,
  typeOverride,
  alt = 'Avatar',
}: ProfilePictureProps) => {
  if (typeOverride) {
    return (
      <ProfilePictureContent
        size={size}
        alt={alt}
        avatarType={typeOverride}
        avatarUrl=""
        initials=""
      />
    );
  }

  return <ProfilePictureGlobal size={size} alt={alt} />;
};

export default ProfilePicture;
