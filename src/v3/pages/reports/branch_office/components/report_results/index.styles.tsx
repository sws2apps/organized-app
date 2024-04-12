import { Box, Divider } from '@mui/material';
import { styled } from '@mui/system';

export const StyledContentBox = styled(Box)({
  gap: '16px',
  display: 'flex',
  flexDirection: 'column',
});

export const StyledContentCardBox = styled(Box)({
  backgroundColor: 'var(--white)',
  border: '1px solid var(--accent-300)',
  borderRadius: 'var(--radius-xl)',
  padding: '16px',
  display: 'flex',
  gap: '16px',
  flexDirection: 'column',
  flex: 19,
});

export const StyledColumnBox = styled(Box)(({ gap }: { gap: string }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap,
}));

export const StyledRowBox = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  justifyContent: 'space-between',
});

export const StyledDivider = styled(Divider)({
  color: 'var(--accent-200)',
});

export const StyledHeaderBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  justifyContent: 'space-between',
});
