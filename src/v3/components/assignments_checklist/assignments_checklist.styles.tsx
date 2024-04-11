import { Box, Checkbox } from '@mui/material';
import { styled } from '@mui/system';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

export const HeaderBox = styled(Box)<{ disabled: boolean }>(({ disabled }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: 'var(--radius-s, 4px)',
  opacity: disabled && '24%',
}));

export const StyledContentBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const StyledTypography = styled(Typography)({
  color: 'var(--always-white)',
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
  color: 'var(--always-white)',
  '& .MuiFormControlLabel-label.Mui-disabled': {
    color: 'var(--always-white)',
  },
});

export const StyledCheckbox = styled(Checkbox)({
  padding: 0,
  '& svg': {
    color: 'var(--always-white)',
  },
});
