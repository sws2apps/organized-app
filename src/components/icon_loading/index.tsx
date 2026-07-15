import { Box, CircularProgress } from '@mui/material';
import { IconLoadingProps } from './index.types';

/**
 * A loading icon component that displays a circular progress indicator.
 *
 * This component centers a MUI `CircularProgress` inside a `Box`,
 * allowing for easy customization of size, color, and styles.
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* disableShrink keeps a constant arc in pure rotation — the default
          grow/shrink dash makes the spinner look off-center at small sizes */}
      <CircularProgress
        size={width}
        disableShrink
        sx={{
          color: color,
          animationDuration: '800ms',
          ...sx,
        }}
      />
    </Box>
  );
};

export default IconLoading;
