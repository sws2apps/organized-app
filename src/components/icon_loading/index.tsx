import { Box, CircularProgress } from '@mui/material';
import { IconLoadingProps } from './index.types';

/**
 * A loading icon component that displays a circular progress indicator.
 *
 * A short bright arc sweeps over a faint full-circle track. The rotation lives
 * on a square, centered wrapper (transform-origin at its center), so the spin
 * is mathematically drift-free — unlike a lone indeterminate arc, whose long
 * off-center segment appears to orbit the middle as it turns.
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
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width,
          height: width,
          animation: 'icon-loading-rotate 0.8s linear infinite',
          '@keyframes icon-loading-rotate': {
            to: { transform: 'rotate(360deg)' },
          },
          ...sx,
        }}
      >
        <CircularProgress
          variant="determinate"
          value={100}
          size={width}
          sx={{ color, opacity: 0.25, position: 'absolute', top: 0, left: 0 }}
        />
        <CircularProgress
          variant="determinate"
          value={25}
          size={width}
          sx={{
            color,
            position: 'absolute',
            top: 0,
            left: 0,
            '& .MuiCircularProgress-circle': { strokeLinecap: 'round' },
          }}
        />
      </Box>
    </Box>
  );
};

export default IconLoading;
