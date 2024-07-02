import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { Select } from '@components/index';

export const StyledSelect = styled(Select)({
  flex: 1,
  height: '48px',
});

export const StyledBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'laptopView',
})(({ laptopView }: { laptopView: boolean }) => ({
  display: 'flex',
  gap: '16px',
  flexDirection: laptopView ? 'row' : 'column',
}));
