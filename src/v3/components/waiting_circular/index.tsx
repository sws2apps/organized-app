import { Box, CircularProgress, SxProps, Theme } from '@mui/material';
import { VariantProps } from './index.types';

const WaitingCircular = ({ variant = 'fixed' }: VariantProps) => {
  let sx: SxProps<Theme> = {};

  if (variant === 'fixed') {
    sx = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
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
      <CircularProgress
        size={80}
        disableShrink={true}
        sx={{
          color: 'var(--accent-dark)',
          ...sx,
        }}
      />
    </Box>
  );
};

export default WaitingCircular;
