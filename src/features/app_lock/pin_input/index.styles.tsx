import { Box, styled } from '@mui/material';

export const PinField = styled(Box)({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
});

export const PinCells = styled(Box)({
  position: 'relative',
  maxWidth: '100%',
});

export const PinSymbols = styled(Box)({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  pointerEvents: 'none',
});
