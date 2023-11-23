import PropTypes from 'prop-types';
import { TextField } from '@mui/material';

const CPESelect = ({
  value,
  onChange,
  label = '',
  className = '',
  sx = {},
  startIcon = null,
  endIcon = null,
  required = false,
  height = 44,
  autoProps,
  InputProps,
  children,
}) => {
  const varHeight = (56 - height) / 2;

  return (
    <TextField
      {...autoProps}
      fullWidth
      required={required}
      label={label}
      value={value}
      onChange={onChange}
      select
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
          marginRight: '32px',
        },
        '.MuiOutlinedInput-root': {
          borderRadius: 'var(--radius-l)',
          color: 'var(--black)',
          '& svg': {
            color: 'var(--accent-350)',
            boxSizing: 'content-box',
          },
          '&.Mui-focused svg': {
            color: 'var(--black)',
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
        startAdornment: startIcon,
        endAdornment: endIcon,
      }}
      inputProps={{
        MenuProps: {
          PaperProps: {
            sx: {
              background: 'var(--white)',
              marginTop: '10px',
              backgroundColor: 'var(--white)',
              borderRadius: 'var(--radius-l)',
              border: '1px solid var(--accent-200)',
              padding: '8px 0px',
              '& ul': { paddingTop: 0, paddingBottom: 0 },
            },
            className: 'small-card-shadow',
          },
        },
      }}
    >
      {children}
    </TextField>
  );
};

CPESelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
  className: PropTypes.string,
  sx: PropTypes.object,
  InputProps: PropTypes.object,
  startIcon: PropTypes.element,
  endIcon: PropTypes.element,
  required: PropTypes.bool,
  height: PropTypes.number,
  autoProps: PropTypes.any,
  children: PropTypes.node,
};

export default CPESelect;
