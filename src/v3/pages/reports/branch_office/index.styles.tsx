import { Box, Divider } from '@mui/material';
import { styled } from '@mui/system';

export const StyledContentBox = styled(Box)({
  display: 'flex',
  gap: '16px',
  flexDirection: 'column',
});

export const StyledPageContentBox = styled(Box)(({ desktopView }: { desktopView: boolean }) => ({
  display: 'flex',
  flexDirection: desktopView ? 'row' : 'column',
  gap: '16px',
}));

export const StyledReportBox = styled(Box)(({ desktopView }: { desktopView: boolean }) => ({
  backgroundColor: 'var(--white)',
  border: '1px solid var(--accent-300)',
  borderRadius: 'var(--radius-xl)',
  padding: '16px',
  display: 'flex',
  gap: '16px',
  flexDirection: 'column',
  height: 'min-content',
  flex: desktopView && 19,
}));

export const StyledDivider = styled(Divider)({
  color: 'var(--accent-200)',
});
