import { Box, CircularProgress } from '@mui/material';
import { IconLoadingProps } from './index.types';

// indeterminate arc layered over a faint determinate track, in a fixed-size
// box so the easing animation never shifts surrounding layout
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
