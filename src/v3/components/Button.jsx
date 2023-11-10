import PropTypes from 'prop-types';
import { Button } from '@mui/material';

const CPEButton = ({ className = 'button-caps', children, onClick, disabled = false, variant = 'main' }) => {
  if (variant === 'main') variant = 'contained';
  if (variant === 'secondary') variant = 'text';
  if (variant === 'tertiary') variant = 'outlined';

  return (
    <Button
      variant={variant}
      onClick={onClick}
      disableRipple
      className={className}
      disabled={disabled}
      sx={{
        padding: '8px 16px',
        backgroundColor: variant === 'contained' ? 'var(--accent-main)' : 'none',
        border: variant === 'outlined' ? '1px solid var(--accent-dark)' : 'none',
        color: variant === 'contained' ? 'var(--always-white)' : 'var(--accent-dark)',
        boxShadow: 'none',
        borderRadius: 'var(--radius-l)',
        '&:hover': {
          backgroundColor: variant === 'contained' ? 'var(--accent-hover)' : 'var(--accent-150)',
          border: variant === 'outlined' ? '1px solid var(--accent-dark)' : 'none',
          boxShadow: 'none',
        },
        '&:active': {
          backgroundColor: variant === 'contained' ? 'var(--accent-dark)' : 'var(--accent-200)',
          border: variant === 'outlined' ? '1px solid var(--accent-dark)' : 'none',
          boxShadow: 'none',
        },
        '&:disabled': {
          backgroundColor: variant === 'contained' ? 'var(--accent-150)' : 'none',
          color: 'var(--accent-350)',
          border: variant === 'outlined' ? '1px solid var(--accent-200)' : 'none',
        },
      }}
    >
      {children}
    </Button>
  );
};

CPEButton.propTypes = {
  className: PropTypes.oneOf(['button-caps', 'button-small-caps']),
  children: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['main', 'secondary', 'tertiary']),
};

export default CPEButton;
