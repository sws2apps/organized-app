import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const StyledProgressBarBox = styled(Box)({});

export const StyledProgressBar = styled(Box)({
  position: 'relative',
  minHeight: '24px',
  display: 'flex',
  alignItems: 'center',
  borderRadius: 'var(--radius-s)',
  background: 'var(--accent-200)',
});

export const StyledProgressBarFill = styled(Box)({
  alignSelf: 'stretch',
  borderRadius: 'var(--radius-s)',
  background: 'var(--accent-main)',
  color: 'var(--always-white)',
  display: 'flex',
  minWidth: '0',
  justifyContent: 'center',
  transition: 'width 0.4s ease, padding 0.4s ease',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});

export const StyledProgressBarToFill = styled(Box)({
  padding: '0 4px',
  alignSelf: 'stretch',
  flexGrow: 1,
  minWidth: 'fit-content',
  borderRadius: 'var(--radius-s)',
  color: 'var(--accent-dark)',
  display: 'flex',
  justifyContent: 'center',
});
