import { TextField, styled } from '@mui/material';

type StyledSmallTextFieldProps = {
  fontColor?: string;
};

export const StyledSmallTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'fontColor',
})<StyledSmallTextFieldProps>(({ fontColor }) => ({
  '.MuiInputBase-root::after, .MuiInputBase-root::before': { content: 'none' },
  '.MuiInput-input': {
    textAlign: 'center',
    fontWeight: '550',
    lineHeight: '24px',
  },
  '.MuiInputBase-root': {
    color: fontColor,
  },
}));
