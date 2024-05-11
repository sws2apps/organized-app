import { InputAdornment, TextField } from '@mui/material';
import { TextFieldTypeProps } from './index.types';

/**
 * A custom text field component.
 *
 * @param {TextFieldTypeProps} props - The props for the CustomTextField component.
 * @returns {JSX.Element} - JSX.Element
 */
const CustomTextField = (props: TextFieldTypeProps) => {
  const height = props.height || 44;
  const sx = props.sx;
  const startIcon = props.startIcon;
  const endIcon = props.endIcon;
  const styleIcon = props.styleIcon ?? true;

  const defaultProps = { ...props };

  delete defaultProps.startIcon;
  delete defaultProps.endIcon;
  delete defaultProps.InputProps;
  delete defaultProps.className;
  delete defaultProps.resetHelperPadding;
  delete defaultProps.styleIcon;

  const varHeight = (56 - height) / 2;

  const isMultiLine = props.multiline || props.rows;

  return (
    <TextField
      {...defaultProps}
      fullWidth
      sx={{
        '.MuiInputBase-root': {
          height: isMultiLine ? 'auto' : `${height}px`,
          paddingTop: isMultiLine ? '0' : 'auto',
          paddingBottom: isMultiLine ? '0' : 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        },
        '.MuiInputBase-input': {
          paddingTop: `calc(14.5px - ${varHeight}px)`,
          paddingBottom: `calc(14.5px - ${varHeight}px)`,
          flex: '1 0 0',
        },
        '.MuiInput-root:before': {
          borderBottom: '1px solid var(--accent-300) !important',
        },
        '.MuiInput-root:after': {
          borderBottom: '1px solid var(--accent-main)',
        },
        '.MuiInput-root:hover:before': {
          borderBottom: '1px solid var(--accent-main)',
          outline: 0,
        },
        '.MuiOutlinedInput-root': {
          borderRadius: 'var(--radius-l)',
          color: 'var(--black)',
          '& svg': {
            boxSizing: 'content-box',
          },
          '& fieldset': {
            border: '1px solid var(--accent-350)',
          },
          '&:hover fieldset': {
            border: '1px solid var(--accent-main)',
          },
          '&.Mui-focused fieldset': {
            border: '1px solid var(--accent-main)',
          },
        },
        '.MuiInputLabel-root': {
          color: 'var(--accent-350)',
          '&.Mui-focused': {
            color: 'var(--accent-main)',
          },
        },
        '.MuiFormLabel-root[data-shrink=false]': { top: `-${varHeight}px` },
        ...sx,
      }}
      InputProps={{
        ...props.InputProps,
        className: props.className,
        startAdornment: startIcon ? (
          <InputAdornment
            position="start"
            sx={{
              height: 0,
              maxHeight: 0,
              marginRight: 0,
              '& svg, & svg g, & svg g path': styleIcon
                ? {
                    fill: startIcon.props.color
                      ? startIcon.props.color
                      : props.value
                        ? 'var(--black)'
                        : 'var(--accent-350)',
                  }
                : {},
            }}
          >
            {startIcon}
          </InputAdornment>
        ) : null,
        endAdornment: props.endIcon ? (
          <InputAdornment
            position="end"
            sx={{
              height: 0,
              maxHeight: 0,
              marginRight: 0,
              '& svg, & svg g, & svg g path': styleIcon
                ? {
                    fill: endIcon.props.color ? endIcon.props.color : 'var(--accent-350)',
                  }
                : {},
            }}
          >
            {endIcon}
          </InputAdornment>
        ) : null,
      }}
      FormHelperTextProps={{
        component: 'div',
        style: {
          margin: 0,
          padding: props.resetHelperPadding ? 0 : '4px 16px 0px 16px',
        },
      }}
      helperText={props.helperText}
    />
  );
};

export default CustomTextField;
