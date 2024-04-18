import { Box, SxProps, Theme } from '@mui/material';
import { VariantProps } from './index.types';
import { IconLoading } from '@components/icons';

/**
 * Circular loading indicator component.
 * @param variant The variant of the loading indicator.
 * @param width The width of the loading indicator.
 * @param height The height of the loading indicator.
 */
const WaitingCircular = ({ variant = 'fixed', width = 72, height = 72 }: VariantProps) => {
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
        <IconLoading width={width} height={height} color="var(--accent-dark)" />
      </Box>
    </Box>
  );
};

export default WaitingCircular;
