import { Box, CircularProgress } from '@mui/material';
import { IconLoadingProps } from './index.types';

/**
 * A loading icon component that displays a circular progress indicator.
 *
 * This component centers a MUI `CircularProgress` inside a `Box`,
 * allowing for easy customization of size, color, and styles.
 */
const IconLoading = ({
  color = '#222222',
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
      <CircularProgress
        size={width - 5}
        sx={{
          color: color,
          '& svg': {
            width: width - 5,
            height: height - 5,
          },
          ...sx,
        }}
      />
    </Box>
  );
};

export default IconLoading;
