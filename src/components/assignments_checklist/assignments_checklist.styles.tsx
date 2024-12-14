import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { styled } from '@mui/system';

export const HeaderBox = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: 'var(--radius-s, 4px)',
}) as unknown as typeof Box;

export const StyledContentBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}) as unknown as typeof Box;

export const StyledTypography = styled(Typography)({
  color: 'var(--always-white)',
  fontSize: '14px',
  fontWeight: '520',
  lineHeight: '20px',
  marginTop: '4px',
  marginBottom: '4px',
}) as unknown as typeof Typography;

export const ChildrenBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: '8px',
  paddingRight: '8px',
}) as unknown as typeof Box;

export const StyledFormControlLabel = styled(FormControlLabel)({
  marginLeft: '4px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: 'var(--always-white)',
  '& .MuiFormControlLabel-label.Mui-disabled': {
    color: 'var(--always-white)',
  },
}) as unknown as typeof FormControlLabel;

export const StyledCheckbox = styled(Checkbox)({
  padding: 0,
  '& svg': {
    color: 'var(--always-white)',
  },
}) as unknown as typeof Checkbox;
