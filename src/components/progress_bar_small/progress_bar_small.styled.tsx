import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const StyledProgressBarSmallBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  height: '24px',
});
export const StyledProgressBarSmallCheck = styled(Box)({
  width: '24px',
  height: '24px',
});

export const StyledProgressBarSmall = styled(Box)({
  position: 'relative',
  width: '96px',
  height: '8px',
  display: 'flex',
  alignItems: 'center',
  borderRadius: 'var(--radius-xs)',
  background: 'var(--accent-200)',
});

export const StyledProgressBarSmallFill = styled(Box)({
  height: '100%',
  borderRadius: 'var(--radius-xs)',
  background: 'var(--accent-main)',
});

export const StyledProgressBarSmallFilled = styled(Box)({
  display: 'flex',
  height: '100%',
  borderRadius: 'var(--radius-xs)',
  background: 'var(--accent-main)',
});
