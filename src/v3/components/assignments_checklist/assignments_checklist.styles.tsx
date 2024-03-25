import { Box } from '@mui/material';
import { styled } from '@mui/system';
import Typography from '../typography';

export const HeaderBox = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: 'var(--radius-s, 4px)',
  // minWidth: 'min-content',
});

export const StyledContentBox = styled(Box)<{ disabled: boolean }>(({ disabled }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  opacity: disabled && '24%',
}));

export const StyledTypography = styled(Typography)<{ showIcon: boolean }>(({ showIcon }) => ({
  color: 'var(--white)',
  fontSize: '14px',
  fontWeight: '520',
  lineHeight: '20px',
  paddingRight: '8px',
  paddingLeft: showIcon ? '4px' : '8px',
  // whiteSpace: 'nowrap',
}));

export const ChildrenBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: '8px',
  paddingRight: '8px',
});

export const IconBox = styled(Box)({
  width: '32px',
  display: 'flex',
  justifyContent: 'center',
  padding: '4px',
});
