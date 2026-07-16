import { Box, useTheme } from '@mui/material';
import { useAtomValue } from 'jotai';
import { navBarOptionsState } from '@states/app';
import { IconArrowBack } from '@components/icons';
import IconButton from '@components/icon_button';
import Typography from '@components/typography';
import { SubpageNavbarProps } from './index.types';

/** Navigation bar for subpages/overlays shown as their own screen (e.g. on mobile). */
const SubpageNavbar = ({
  title,
  secondaryTitle,
  onBack,
  backLabel,
  trailing,
}: SubpageNavbarProps) => {
  const theme = useTheme();

  const navBarOptions = useAtomValue(navBarOptionsState);
  const subtitle = secondaryTitle ?? navBarOptions.title;

  const ellipsis = {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxWidth: '100%',
  } as const;

  return (
    <Box
      sx={{
        flexShrink: 0,
        minHeight: '62px',
        display: 'flex',
        alignItems: 'center',
        gap: { mobile: '8px', tablet: '16px' },
        backgroundColor: 'var(--accent-100)',
        borderBottom: '1px solid var(--accent-200)',
        padding: { mobile: '4px 16px', tablet: '6px 32px' },
      }}
    >
      <IconButton
        aria-label={backLabel}
        onClick={onBack}
        sx={{
          flexShrink: 0,
          marginLeft: '-10px',
          '&:hover': {
            backgroundColor: 'var(--accent-200)',
            '& svg': {
              transform:
                theme.direction === 'rtl'
                  ? 'translateX(-4px) scaleX(-1)'
                  : 'translateX(4px)',
            },
          },
          '& svg': { transition: 'transform 0.2s ease-in-out' },
        }}
      >
        <IconArrowBack color="var(--black)" />
      </IconButton>

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: '-8px',
          alignItems: { mobile: 'center', tablet688: 'flex-start' },
          textAlign: { mobile: 'center', tablet688: 'left' },
        }}
      >
        <Typography className="h3" color="var(--black)" sx={ellipsis}>
          {title}
        </Typography>
        {subtitle && (
          <Typography
            className="label-small-regular"
            color="var(--accent-400)"
            sx={ellipsis}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {trailing ?? (
        <Box
          sx={{
            width: '22px',
            height: '22px',
            flexShrink: 0,
            display: { mobile: 'block', tablet688: 'none' },
          }}
        />
      )}
    </Box>
  );
};

export default SubpageNavbar;
