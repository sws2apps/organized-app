import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export { default as StyledNavigationArrowButton } from './navigation_arrow_button';

export const DoubleFieldContainer = styled(Box)({
  display: 'flex',
  gap: '16px',
});

export const PrimaryFieldContainer = styled(Box)({
  flex: 1,
});

export const SecondaryFieldContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});
