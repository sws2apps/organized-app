import { TextField, styled } from '@mui/material';

/**
 * Props for the StyledSmallTextField component.
 *
 * @typedef {Object} StyledSmallTextFieldProps
 * @property {string} [fontColor] - The font color for the input text.
 */
type StyledSmallTextFieldProps = {
  fontColor?: string;
};

/**
 * A styled TextField component with customized styles.
 *
 * @component
 * @example
 * <StyledSmallTextField fontColor="red" />
 *
 * @param {StyledSmallTextFieldProps} props - The props for the component.
 * @returns {JSX.Element} The styled TextField component.
 */
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
  'input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0,
  },

  'input[type=number]': {
    '-moz-appearance': 'textfield',
  },
}));
