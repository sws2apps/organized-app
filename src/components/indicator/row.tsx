import { Box, BoxProps } from '@mui/material';

const IndicatorRow = ({ children, sx, ...props }: BoxProps) => {
  return (
    <Box
      {...props}
      sx={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) max-content',
        gap: '8px',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default IndicatorRow;
