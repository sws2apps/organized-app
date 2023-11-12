import PropTypes from 'prop-types';
import { Button } from '@mui/material';

const CPEButton = ({
  className = 'button-caps',
  children,
  onClick,
  disabled = false,
  variant = 'main',
  startIcon,
  endIcon,
  color,
}) => {
  let internalVariant = 'contained';

  if (variant === 'main' || variant === 'semi-white') internalVariant = 'contained';
  if (variant === 'secondary' || variant === 'small') internalVariant = 'text';
  if (variant === 'tertiary') internalVariant = 'outlined';

  if (variant === 'small') className = 'body-small-semibold';

  return (
    <Button
      startIcon={startIcon}
      endIcon={endIcon}
      variant={internalVariant}
      onClick={onClick}
      disableRipple
      className={className}
      disabled={disabled}
      sx={{
        padding: variant === 'small' ? '4px 8px' : '8px 16px',
        backgroundColor:
          variant === 'semi-white'
            ? 'var(--white-semi-16)'
            : internalVariant === 'contained'
            ? 'var(--accent-main)'
            : 'unset',
        border: internalVariant === 'outlined' ? '1px solid var(--accent-dark)' : 'none',
        color: color
          ? `var(--${color}-dark)`
          : internalVariant === 'contained'
          ? 'var(--always-white)'
          : 'var(--accent-dark)',
        boxShadow: 'none',
        borderRadius: variant === 'small' || variant === 'semi-white' ? 'var(--radius-m)' : 'var(--radius-l)',
        '&:hover': {
          backgroundColor: color
            ? `var(--${color}-secondary)`
            : variant === 'semi-white'
            ? 'var(--white-semi-48)'
            : internalVariant === 'contained'
            ? 'var(--accent-dark)'
            : 'var(--accent-200)',
          border: internalVariant === 'outlined' ? '1px solid var(--accent-dark)' : 'none',
          boxShadow: 'none',
          borderRadius:
            variant === 'small' ? 'var(--radius-s)' : variant === 'semi-white' ? 'var(--radius-m)' : 'var(--radius-l)',
        },
        '&:active': {
          backgroundColor: color
            ? `var(--${color}-secondary)`
            : variant === 'semi-white'
            ? 'var(--white-semi-32)'
            : variant === 'small'
            ? 'var(--accent-200)'
            : internalVariant === 'contained'
            ? 'var(--accent-click)'
            : 'var(--accent-150)',
          border: internalVariant === 'outlined' ? '1px solid var(--accent-dark)' : 'none',
          boxShadow: 'none',
          borderRadius:
            variant === 'small' ? 'var(--radius-s)' : variant === 'semi-white' ? 'var(--radius-m)' : 'var(--radius-l)',
          opacity: variant === 'small' ? 0.8 : 1,
        },
        '&:disabled': {
          backgroundColor: internalVariant === 'contained' ? 'var(--accent-150)' : 'unset',
          color: 'var(--accent-350)',
          border: internalVariant === 'outlined' ? '1px solid var(--accent-200)' : 'none',
        },
        '& svg': {
          height: variant === 'small' ? '20px' : '22px',
          width: variant === 'small' ? '20px' : '22px',
        },
        '& svg, & svg g, & svg g path': {
          fill: color
            ? `var(--${color}-dark)`
            : disabled
            ? 'var(--accent-350)'
            : internalVariant === 'contained'
            ? 'var(--always-white)'
            : 'var(--accent-dark)',
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
  variant: PropTypes.oneOf(['main', 'secondary', 'tertiary', 'small', 'semi-white']),
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  color: PropTypes.string,
};

export default CPEButton;
