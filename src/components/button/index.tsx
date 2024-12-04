import { Button as MUIButton, ButtonProps } from '@mui/material';
import { ButtonPropsType } from './index.types';
import { FC } from 'react';

/**
 * Component for rendering a custom button.
 * @param {ButtonPropsType} props - Props for the CustomButton component.
 * @returns {JSX.Element} CustomButton component.
 */
const Button: FC<ButtonPropsType> = (props) => {
  let className = props.className || 'button-caps';
  const disabled = props.disabled || false;
  const variant = props.variant || 'main';
  const disableAutoStretch = props.disableAutoStretch || false;
  const color = props.color;

  let internalVariant: ButtonProps['variant'] = 'contained';

  if (variant === 'main' || variant === 'semi-white')
    internalVariant = 'contained';
  if (variant === 'secondary' || variant === 'small') internalVariant = 'text';
  if (variant === 'tertiary' || variant === 'group')
    internalVariant = 'outlined';

  if (variant === 'small') className = 'body-small-semibold';

  const getBackgroundColor = () => {
    let result = '';

    if (variant === 'semi-white') {
      result = 'var(--white-semi-s)';
    }

    if (variant !== 'semi-white') {
      if (internalVariant !== 'contained') {
        result = 'unset';
      }

      if (internalVariant === 'contained') {
        if (color) {
          result = `var(--${color}-main)`;
        }

        if (!color) {
          result = 'var(--accent-main)';
        }
      }
    }

    return result;
  };

  const getColor = () => {
    let result = '';

    if (internalVariant === 'contained') {
      result = 'var(--always-white)';
    }

    if (internalVariant !== 'contained') {
      if (!color) {
        result = 'var(--accent-dark)';
      }

      if (color) {
        if (variant === 'small') {
          result = `var(--${color}-dark)`;
        }

        if (variant !== 'small') {
          result = `var(--${color}-main)`;
        }
      }
    }

    return result;
  };

  const getBackgroundColorHover = () => {
    let result = '';

    if (variant === 'semi-white') {
      result = 'var(--white-semi-l)';
    }

    if (variant !== 'semi-white') {
      if (internalVariant === 'contained') {
        if (color) {
          result = `var(--${color}-dark)`;
        }

        if (!color) {
          result = 'var(--accent-dark)';
        }
      }

      if (internalVariant !== 'contained') {
        if (color) {
          result = `var(--${color}-secondary)`;
        }

        if (!color) {
          result = 'var(--accent-200)';
        }
      }
    }

    return result;
  };

  const getBackgroundColorClick = () => {
    let result = '';

    if (variant === 'semi-white') {
      result = 'var(--white-semi-m)';
    }

    if (variant !== 'semi-white') {
      if (variant === 'small') {
        if (color) {
          result = `var(--${color}-secondary)`;
        }

        if (!color) {
          result = 'var(--accent-200)';
        }
      }

      if (variant !== 'small') {
        if (internalVariant === 'contained') {
          if (color) {
            result = `var(--${color}-dark)`;
          }

          if (!color) {
            result = 'var(--accent-click)';
          }
        }

        if (internalVariant !== 'contained') {
          if (color) {
            result = `var(--${color}-secondary)`;
          }

          if (!color) {
            result = 'var(--accent-150)';
          }
        }
      }
    }

    return result;
  };

  const getSvgColor = () => {
    let result = '';

    if (disabled) {
      result = 'var(--accent-350)';
    }

    if (!disabled) {
      if (internalVariant === 'contained') {
        result = 'var(--always-white)';
      }

      if (internalVariant !== 'contained') {
        if (color) {
          if (variant === 'small') {
            result = `var(--${color}-dark)`;
          }

          if (variant !== 'small') {
            result = `var(--${color}-main)`;
          }
        }

        if (!color) {
          result = 'var(--accent-dark)';
        }
      }
    }

    return result;
  };

  return (
    <MUIButton
      startIcon={props.startIcon}
      endIcon={props.endIcon}
      variant={internalVariant}
      onClick={props.onClick}
      disableRipple
      className={className}
      disabled={disabled}
      rel={props.rel}
      href={props.href}
      sx={{
        cursor: 'pointer',
        minHeight: props.minHeight ? `${props.minHeight}px` : '44px',
        fontFeatureSettings: '"cv05"',
        padding: variant === 'small' ? '4px 8px' : '8px 16px',
        backgroundColor: getBackgroundColor(),
        border:
          internalVariant === 'outlined'
            ? '1px solid var(--accent-dark)'
            : 'none',
        color: getColor(),
        boxShadow: 'none',
        borderRadius:
          variant === 'small' || variant === 'semi-white'
            ? 'var(--radius-m)'
            : 'var(--radius-l)',
        '&:hover': {
          backgroundColor: getBackgroundColorHover(),
          border:
            internalVariant === 'outlined'
              ? '1px solid var(--accent-dark)'
              : 'none',
          boxShadow: 'none',
          borderRadius:
            variant === 'group'
              ? 'none'
              : variant === 'small' || variant === 'semi-white'
                ? 'var(--radius-m)'
                : 'var(--radius-l)',
          '@media (hover: none)': {
            backgroundColor: getBackgroundColor(),
          },
        },

        '&:active': {
          backgroundColor: getBackgroundColorClick(),
          border:
            internalVariant === 'outlined'
              ? '1px solid var(--accent-dark)'
              : 'none',
          boxShadow: 'none',
          borderRadius:
            variant === 'group'
              ? 'none'
              : variant === 'small'
                ? 'var(--radius-s)'
                : variant === 'semi-white'
                  ? 'var(--radius-m)'
                  : 'var(--radius-l)',
          opacity: variant === 'small' || color ? 0.8 : 1,
        },
        '&:disabled': {
          backgroundColor:
            internalVariant === 'contained' ? 'var(--accent-150)' : 'unset',
          color: 'var(--accent-350)',
          border:
            internalVariant === 'outlined'
              ? '1px solid var(--accent-200)'
              : 'none',
        },
        '& svg': {
          height: variant === 'small' ? '20px' : '22px',
          width: variant === 'small' ? '20px' : '22px',
        },
        '& svg, & svg g, & svg g path': {
          fill: getSvgColor(),
        },
        width: { mobile: disableAutoStretch ? 'auto' : '100%', tablet: 'auto' },
        ...props.sx,
      }}
    >
      {props.children}
    </MUIButton>
  );
};

export default Button;
