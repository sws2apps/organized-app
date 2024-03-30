import { Box, Checkbox } from '@mui/material';
import { styled } from '@mui/system';
import Typography from '../typography';
import FormControlLabel from '@mui/material/FormControlLabel';
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

export const StyledTypography = styled(Typography)({
  color: 'var(--white)',
  fontSize: '14px',
  fontWeight: '520',
  lineHeight: '20px',
});
export const ChildrenBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: '8px',
  paddingRight: '8px',
});

export const StyledFormControlLabel = styled(FormControlLabel)({
  marginLeft: '4px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: 'var(--white)',
  '& .MuiFormControlLabel-label.Mui-disabled': {
    color: 'var(--white)',
  },
});

export const StyledCheckbox = styled(Checkbox)({
  padding: 0,
  '& svg': {
    color: 'var(--white)',
  },
});
