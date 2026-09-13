import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import IconButton from '@components/icon_button';
import ProfilePicture from '@components/profile_picture';
import { IconEdit } from '@icons/index';

type Props = { size: number; onOpen: () => void };

const ProfilePictureEntry = ({ size, onOpen }: Props) => {
  const { t } = useAppTranslation();

  return (
    <IconButton
      onClick={onOpen}
      aria-label={t('tr_changeProfilePicture')}
      aria-haspopup="dialog"
      sx={{
        position: 'relative',
        margin: 0,
        padding: 0,
        flexShrink: 0,
        borderRadius: 'var(--radius-max)',
        '&:hover .avatar-hover, &:focus-visible .avatar-hover': { opacity: 1 },
        '&:focus-visible': {
          outline: '2px solid var(--accent-main)',
          outlineOffset: '4px',
        },
      }}
    >
      <ProfilePicture size={size} alt="" />
      <Box
        component="span"
        className="avatar-hover"
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'var(--radius-max)',
          backgroundColor: 'var(--accent-dark-overlay)',
          opacity: 0,
          pointerEvents: 'none',
          transition: 'opacity var(--motion-fast) var(--ease-standard)',
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        }}
      />
      <Box
        component="span"
        aria-hidden
        sx={{
          position: 'absolute',
          bottom: '-2px',
          insetInlineEnd: '-2px',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--radius-max)',
          backgroundColor: 'var(--accent-main)',
          border: '2px solid var(--white)',
          pointerEvents: 'none',
        }}
      >
        <IconEdit color="var(--always-white)" width={14} height={14} />
      </Box>
    </IconButton>
  );
};

export default ProfilePictureEntry;
