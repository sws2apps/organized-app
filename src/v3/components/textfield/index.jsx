import PropTypes from 'prop-types';
import { TextField } from '@mui/material';

const CPETextField = ({ value, onChange, label = '', className = '', sx = {} }) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      sx={{
        '.MuiOutlinedInput-root': {
          borderRadius: 'var(--radius-l)',
          paddingRight: '8px',
          color: 'var(--black)',
          '& svg': {
            color: 'var(--accent-350)',
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
        ...sx,
      }}
      InputProps={{
        className: className,
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
};

export default CPETextField;
