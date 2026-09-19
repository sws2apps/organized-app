import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import Button from '@components/button';

export const LabelContainer = styled(Box)(({ theme }) => ({
  borderRadius: 'var(--radius-s)',
  padding: '8px 32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  width: '100%',
  [theme.containerQueries.up(350)]: {
    width: '50%',
  },
  userSelect: 'none',
}));

export const ActionButton = styled(Button)({
  minHeight: '40px',
  height: '40px',
  flex: 1,
  width: '50%',
});
