import { Box, SxProps, Theme } from '@mui/material';
import IconLoading from '@components/icon_loading';
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
}: VariantProps) => {
  let sx: SxProps<Theme> = {};

  if (variant === 'fixed') {
    sx = {
      position: 'absolute',
      top: '50%',
      margin: 'auto',
    };
  }

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
          <IconLoading width={size} height={size} color="var(--accent-dark)" />
        )}
      </Box>
    </Box>
  );
};

export default WaitingLoader;
