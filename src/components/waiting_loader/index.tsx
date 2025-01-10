import { Box, CircularProgress, SxProps, Theme } from '@mui/material';
import { VariantProps } from './index.types';
import LottieLoader from '@components/lottie_loader';

/**
 * Circular loading indicator component.
 * @param variant The variant of the loading indicator.
 * @param size (width and height)
 */
const WaitingLoader = ({
  variant = 'fixed',
  size,
  type = 'circular',
  color = 'var(--accent-dark)',
}: VariantProps) => {
  let sx: SxProps<Theme> = {};

  if (variant === 'fixed' && type !== 'circular') {
    sx = {
      position: 'absolute',
      top: '50%',
      margin: 'auto',
    };
  }

  const circularLoaderSize = size - 5;

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box sx={sx}>
        {type === 'lottie' && <LottieLoader size={size} />}

        {type === 'circular' && (
          <CircularProgress
            size={circularLoaderSize}
            sx={{
              color: color,
              '& svg': {
                width: circularLoaderSize,
                height: circularLoaderSize,
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default WaitingLoader;
