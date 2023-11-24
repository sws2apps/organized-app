import PropTypes from 'prop-types';
import { InputAdornment, TextField } from '@mui/material';

const CPETextField = ({
  value,
  onChange,
  label = '',
  className = '',
  sx = {},
  startIcon = null,
  endIcon = null,
  autoComplete = 'off',
  required = false,
  height = 44,
  autoProps,
  InputProps,
}) => {
  const varHeight = (56 - height) / 2;

  return (
    <TextField
      {...autoProps}
      fullWidth
      autoComplete={autoComplete}
      required={required}
      label={label}
      value={value}
      onChange={onChange}
      sx={{
        '.MuiInputBase-root': {
          height: `${height}px`,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        },
        '.MuiInputBase-input': {
          paddingTop: `calc(14.5px - ${varHeight}px)`,
          paddingBottom: `calc(14.5px - ${varHeight}px)`,
          flex: '1 0 0',
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
        ...InputProps,
        className: className,
        startAdornment: startIcon ? (
          <InputAdornment
            position="start"
            sx={{
              height: 0,
              maxHeight: 0,
              marginRight: 0,
              '& svg, & svg g, & svg g path': {
                fill: startIcon.props.color ? startIcon.props.color : value ? 'var(--black)' : 'var(--accent-350)',
              },
            }}
          >
            {startIcon}
          </InputAdornment>
        ) : null,
        endAdornment: endIcon ? (
          <InputAdornment
            position="end"
            sx={{
              height: 0,
              maxHeight: 0,
              marginRight: 0,
              '& svg, & svg g, & svg g path': {
                fill: endIcon.props.color ? endIcon.props.color : value ? 'var(--black)' : 'var(--accent-350)',
              },
            }}
          >
            {endIcon}
          </InputAdornment>
        ) : null,
      }}
    />
  );
};

CPETextField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
  className: PropTypes.string,
  sx: PropTypes.object,
  InputProps: PropTypes.object,
  startIcon: PropTypes.element,
  endIcon: PropTypes.element,
  autoComplete: PropTypes.oneOf(['on', 'off']),
  required: PropTypes.bool,
  height: PropTypes.number,
  autoProps: PropTypes.any,
};

export default CPETextField;
