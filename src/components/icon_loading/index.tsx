import { Box, CircularProgress } from '@mui/material';
import { IconLoadingProps } from './index.types';

/**
 * A loading icon component that displays a circular progress indicator.
 *
 * A faint full-circle track sits behind a rotating arc so the spinner reads
 * as a clean, centered spin — a lone indeterminate arc has its visual mass
 * off-center and appears to drift as it rotates.
 */
const IconLoading = ({
  color = 'var(--black)',
  width = 24,
  height = 24,
  sx = {},
}: IconLoadingProps) => {
  return (
    <Box
      sx={{
        width,
        height,
        position: 'relative',
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress
        variant="determinate"
        value={100}
        size={width}
        sx={{ color, opacity: 0.25, position: 'absolute' }}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        size={width}
        sx={{
          color,
          animationDuration: '800ms',
          '& .MuiCircularProgress-circle': { strokeLinecap: 'round' },
          ...sx,
        }}
      />
    </Box>
  );
};

export default IconLoading;
