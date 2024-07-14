import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const StyledProgressBarBox = styled(Box)({});

export const StyledProgressBarCheck = styled(Box)({
  width: '24px',
  height: '24px',
});

export const StyledProgressBar = styled(Box)({
  position: 'relative',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  borderRadius: 'var(--radius-s)',
  background: 'var(--accent-200)',
});

export const StyledProgressBarFill = styled(Box)({
  padding: '0 8px',
  height: '100%',
  borderRadius: 'var(--radius-s)',
  background: 'var(--accent-main)',
  color: 'var(--always-white)',
  display: 'flex',
  minWidth: 'fit-content',
  justifyContent: 'center',
});
export const StyledProgressBarToFill = styled(Box)({
  padding: '0 8px',
  height: '100%',
  flexGrow: 1,
  minWidth: 'fit-content',
  borderRadius: 'var(--radius-s)',
  color: 'var(--accent-dark)',
  display: 'flex',
  justifyContent: 'center',
});

export const StyledProgressBarFilled = styled(Box)({
  display: 'flex',
  height: '100%',
  borderRadius: 'var(--radius-s)',
  background: 'var(--accent-main)',
});
