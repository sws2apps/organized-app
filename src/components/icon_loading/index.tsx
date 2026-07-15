import { Box, CircularProgress } from '@mui/material';
import { IconLoadingProps } from './index.types';

/**
 * A loading icon component that displays a circular progress indicator.
 *
 * MUI's indeterminate `CircularProgress` (the arc eases longer and shorter as
 * it spins) layered over a faint determinate track. Wrapped in a fixed-size
 * box so the rotating spinner never changes the layout around it.
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
        thickness={4}
        sx={{ color, opacity: 0.25, position: 'absolute' }}
      />
      <CircularProgress
        variant="indeterminate"
        size={width}
        thickness={4}
        sx={{
          color,
          '& .MuiCircularProgress-circle': { strokeLinecap: 'round' },
          ...sx,
        }}
      />
    </Box>
  );
};

export default IconLoading;
