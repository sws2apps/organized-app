import { Box, Divider, Typography } from '@mui/material';
import TextField from '@components/textfield';
import { styled } from '@mui/system';

export const StyledContentBox = styled(Box)({
  display: 'flex',
  gap: '16px',
  flexDirection: 'column',
});

export const StyledBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'row',
})(({ row }: { row: boolean }) => ({
  display: 'flex',
  flexDirection: row ? 'row' : 'column',
  gap: '16px',
}));

export const StyledReportBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'desktopView',
})(({ desktopView }: { desktopView: boolean }) => ({
  backgroundColor: 'var(--white)',
  border: '1px solid var(--accent-300)',
  borderRadius: 'var(--radius-xl)',
  padding: '16px',
  display: 'flex',
  gap: '24px',
  flexDirection: 'column',
  height: 'min-content',
  flex: desktopView && 19,
}));

export const StyledDivider = styled(Divider)({
  color: 'var(--accent-200)',
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

export const StyledColumnBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'gap',
})(({ gap }: { gap: string }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: gap,
}));

export const StyledHeaderBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  justifyContent: 'space-between',
});
