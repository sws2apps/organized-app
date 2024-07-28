import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { Select } from '@components/index';

export const StyledSelect = styled(Select)({
  flex: 1,
});

export const StyledBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'laptopView',
})(({ laptopView }: { laptopView: boolean }) => ({
  display: 'flex',
  gap: '16px',
  flexDirection: laptopView ? 'row' : 'column',
}));

export const StyledColorBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'backgroundColor',
})<{
  backgroundColor: string;
}>((props) => ({
  backgroundColor: props.backgroundColor,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 'var(--radius-l)',
  alignItems: 'center',
  justifyContent: 'center',
  height: '48px',
  width: '100%',
}));
