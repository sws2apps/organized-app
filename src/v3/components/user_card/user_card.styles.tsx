import { Box, Card, CardContent } from '@mui/material';
import { styled } from '@mui/system';

export const StyledCard = styled(Card)({
  minWidth: 432,
  maxWidth: 432,
  borderRadius: 'var(--radius-l, 8px)',
  border: 'var(--radius-none, 1px) solid var(--accent-300, #A5B3DD)',
  background: 'var(--white, #FEFEFE); }}',
});

export const StyledCardContent = styled(CardContent)({
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const StyledIconWrapper = styled(Box)<{ hoverBackgrColor: string; iconColor: string }>(
  ({ hoverBackgrColor, iconColor }) => ({
    '& svg:hover': {
      background: hoverBackgrColor,
      borderRadius: 'var(--radius-xl, 8px)',
      cursor: 'pointer',
    },
    '& svg g, & svg g path': {
      fill: iconColor,
    },
  })
);

export const StyledBoxSpaceBetween = styled(Box)<{ flexDirection: 'row' | 'column' }>(({ flexDirection }) => ({
  display: 'flex',
  flexDirection: flexDirection,
  justifyContent: 'space-between',
}));

export const StyledBox = styled(Box)<{ flexDirection?: 'row' | 'column'; gap?: string }>(
  ({ flexDirection = 'row', gap }) => ({
    display: 'flex',
    flexDirection: flexDirection,
    gap: gap || '0px',
  })
);
