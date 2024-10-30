import { Box, SxProps, Theme } from '@mui/material';
import { VariantProps } from './index.types';
import LottieLoader from '@components/lottie_loader';

/**
 * Circular loading indicator component.
 * @param variant The variant of the loading indicator.
 * @param size (width and height)
 */
const WaitingLoader = ({ variant = 'fixed' }: VariantProps) => {
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
        <LottieLoader />
      </Box>
    </Box>
  );
};

export default WaitingLoader;
