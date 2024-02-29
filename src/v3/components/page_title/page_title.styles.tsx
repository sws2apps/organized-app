import { Box, IconButton } from '@mui/material';
import { styled } from '@mui/system';

export const PageTitleContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const PageTitleBlock = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
});

export const PageTitleIcon = styled(IconButton)({
  padding: 0,
});

export const PageTitleButtonsContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});
