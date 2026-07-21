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
  const ariaLabel = props.ariaLabel;

  let internalVariant: ButtonProps['variant'] = 'contained';

  if (variant === 'main' || variant === 'semi-white')
    internalVariant = 'contained';
  if (variant === 'secondary' || variant === 'small') internalVariant = 'text';
  if (variant === 'tertiary' || variant === 'group')
    internalVariant = 'outlined';

  if (variant === 'small') className = 'body-small-semibold';

  const isGradient = variant === 'main';

  const gradientTop = color
    ? `color-mix(in oklch, var(--${color}-main), white 15%)`
    : 'var(--accent-gradient-top)';
  const topHighlight = `linear-gradient(180deg, ${gradientTop} 0%, transparent 100%)`;
  const overlayBorderTop =
    'linear-gradient(180deg, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0) 100%)';
  const overlayBorderBottom =
    'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.05) 100%)';
  const gradientBackground = `${topHighlight}, ${overlayBorderTop}, ${overlayBorderBottom}`;

  const darkenOverlay = 'inset 0 0 0 1000px var(--btn-hover-overlay)';
  const noOverlay =
    'inset 0 0 0 1000px rgba(var(--accent-dark-overlay-base), 0)';

  const springEasing = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

  const hasPressScale =
    isGradient || variant === 'secondary' || variant === 'tertiary';

  const getBorder = (isDisabled = false) => {
    if (isGradient) {
      return '2px solid transparent';
    }

    if (internalVariant !== 'outlined') {
      return 'none';
    }

    return `1px solid var(--accent-${isDisabled ? '200' : 'dark'})`;
  };

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
        const overrideColor =
          props.startIcon?.props?.['color'] || props.endIcon?.props?.['color'];

        result = overrideColor ?? 'var(--always-white)';
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

  const safeRel = (() => {
    if (props.target === '_blank') {
      const tokens = (props.rel || '').split(' ').filter(Boolean);
      if (!tokens.includes('noopener')) tokens.push('noopener');
      if (!tokens.includes('noreferrer')) tokens.push('noreferrer');
      return tokens.join(' ');
    }
    return props.rel;
  })();

  return (
    <MUIButton
      startIcon={props.startIcon}
      endIcon={props.endIcon}
      aria-label={ariaLabel}
      variant={internalVariant}
      onClick={props.onClick}
      disableRipple
      className={className}
      disabled={disabled}
      rel={safeRel}
      href={props.href}
      target={props.target}
      sx={{
        cursor: 'pointer',
        minHeight: props.minHeight ? `${props.minHeight}px` : '40px',
        fontFeatureSettings: '"cv05"',
        padding: variant === 'small' ? '4px 8px' : '8px 16px',
        backgroundColor: getBackgroundColor(),
        ...(isGradient && {
          backgroundImage: gradientBackground,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box, border-box',
        }),
        ...(hasPressScale && {
          transition: isGradient
            ? `box-shadow 0.2s ease, transform 0.22s ${springEasing}`
            : `background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.22s ${springEasing}`,
        }),
        border: getBorder(),
        color: getColor(),
        boxShadow: isGradient ? noOverlay : 'none',
        borderRadius:
          variant === 'small' || variant === 'semi-white'
            ? 'var(--radius-m)'
            : 'var(--radius-l)',
        '&:hover': {
          backgroundColor: isGradient
            ? getBackgroundColor()
            : getBackgroundColorHover(),
          boxShadow: isGradient ? darkenOverlay : 'none',
          border: getBorder(),
          borderRadius:
            variant === 'group'
              ? 'none'
              : variant === 'small' || variant === 'semi-white'
                ? 'var(--radius-m)'
                : 'var(--radius-l)',
          '@media (hover: none)': {
            backgroundColor: getBackgroundColor(),
            ...(isGradient && { boxShadow: noOverlay }),
          },
        },

        '&:focus-visible': {
          outline: 'var(--accent-main) auto 1px',
        },

        '&:active': {
          backgroundColor: isGradient
            ? getBackgroundColor()
            : getBackgroundColorClick(),
          ...(hasPressScale && { transform: 'scale(0.985)' }),
          boxShadow: isGradient ? noOverlay : 'none',
          border: getBorder(),
          borderRadius:
            variant === 'group'
              ? 'none'
              : variant === 'small'
                ? 'var(--radius-s)'
                : variant === 'semi-white'
                  ? 'var(--radius-m)'
                  : 'var(--radius-l)',
          opacity: !isGradient && (variant === 'small' || color) ? 0.8 : 1,
        },
        '&:disabled': {
          backgroundColor:
            internalVariant === 'contained' ? 'var(--accent-150)' : 'unset',
          ...(isGradient && { backgroundImage: 'none' }),
          color: 'var(--accent-350)',
          border: getBorder(true),
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
