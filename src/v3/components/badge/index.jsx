import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const BadgeContent = ({ icon, iconHeight, iconWidth, children, color }) => (
  <Box sx={{ display: 'flex', flexDirection: 'row' }}>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexShrink: '0',
        '& svg': {
          height: iconHeight,
          width: iconWidth,
        },
        '& svg, & svg g, & svg g path': {
          fill: color,
        },
        paddingRight: '4px',
      }}
    >
      {icon && icon}
    </Box>
    {children}
  </Box>
);

BadgeContent.propTypes = {
  color: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  icon: PropTypes.element,
  iconHeight: PropTypes.number.isRequired,
  iconWidth: PropTypes.number.isRequired,
};

const BadgeTypography = ({ children, sx = {} }) => (
  <Typography
    sx={{
      display: 'flex',
      alignItems: 'center',
      fontFamily: 'Inter',
      fontStyle: 'normal',
      letterSpacing: '-0.12px',
      ...sx,
    }}
  >
    {children}
  </Typography>
);

BadgeTypography.propTypes = {
  children: PropTypes.element.isRequired,
  sx: PropTypes.object,
};

const CPEBadge = ({ icon, size, filled, color, text, sx = {} }) => {
  const getColor = () => {
    let result = '';

    if (filled) return `var(--always-white)`;

    if (size == 'small') {
      if (color == 'grey') {
        result = `var(--${color}-400)`;
      } else if (color == 'green') {
        result = `var(--${color}-main)`;
      } else if (color == 'orange') {
        result = `var(--${color}-dark)`;
      } else if (color == 'red') {
        result = `var(--${color}-dark)`;
      } else if (color == 'accent') {
        result = `var(--${color}-dark)`;
      }
    } else if (size == 'medium') {
      if (color == 'grey') {
        result = `var(--${color}-400)`;
      } else if (color == 'green') {
        result = `var(--${color}-main)`;
      } else if (color == 'orange') {
        result = `var(--${color}-dark)`;
      } else if (color == 'red') {
        result = `var(--${color}-dark)`;
      } else if (color == 'accent') {
        result = `var(--${color}-dark)`;
      }
    } else if (size == 'big') {
      if (color == 'grey') {
        result = `var(--${color}-400)`;
      } else if (color == 'green') {
        result = `var(--${color}-main)`;
      } else if (color == 'orange') {
        result = `var(--${color}-dark)`;
      } else if (color == 'red') {
        result = `var(--${color}-main)`;
      } else if (color == 'accent') {
        result = `var(--${color}-dark)`;
      }
    }

    return result;
  };

  const getBackgroundColor = () => {
    let result = '';

    if (filled) {
      if (color == 'grey') {
        result = `var(--${color}-400)`;
      } else if (color == 'green') {
        result = `var(--${color}-main)`;
      } else if (color == 'orange') {
        result = `var(--${color}-main)`;
      } else if (color == 'red') {
        result = `var(--${color}-main)`;
      } else if (color == 'accent') {
        result = `var(--${color}-main)`;
      }
      return result;
    }

    if (size == 'small') {
      if (color == 'grey') {
        result = `var(--${color}-150)`;
      } else if (color == 'green') {
        result = `var(--${color}-secondary)`;
      } else if (color == 'orange') {
        result = `var(--${color}-secondary)`;
      } else if (color == 'red') {
        result = `var(--${color}-secondary)`;
      } else if (color == 'accent') {
        result = `var(--${color}-200)`;
      }
    } else if (size == 'medium') {
      if (color == 'grey') {
        result = `var(--${color}-150)`;
      } else if (color == 'green') {
        result = `var(--${color}-secondary)`;
      } else if (color == 'orange') {
        result = `var(--${color}-secondary)`;
      } else if (color == 'red') {
        result = `var(--${color}-secondary)`;
      } else if (color == 'accent') {
        result = `var(--${color}-200)`;
      }
    } else if (size == 'big') {
      if (color == 'grey') {
        result = `var(--${color}-150)`;
      } else if (color == 'green') {
        result = `var(--${color}-secondary)`;
      } else if (color == 'orange') {
        result = `var(--${color}-secondary)`;
      } else if (color == 'red') {
        result = `var(--${color}-secondary)`;
      } else if (color == 'accent') {
        result = `var(--${color}-200)`;
      }
    }

    return result;
  };

  return (
    <>
      {size == 'small' && (
        <Box
          sx={{
            border: '2px',
            height: '20px',
            background: getBackgroundColor(),
            display: 'flex',
            flexDirection: 'row',
            borderRadius: 'var(--radius-xs, 2px)',
            gap: '4px',
            padding: '2px 6px',
            ...sx,
          }}
        >
          <BadgeContent icon={icon} iconHeight={'16px'} iconWidth={'16px'} color={getColor()}>
            <BadgeTypography
              sx={{
                fontSize: '12px',
                fontWeight: '500',
                lineHeight: '16px',
                color: getColor(),
              }}
            >
              {text}
            </BadgeTypography>
          </BadgeContent>
        </Box>
      )}
      {size == 'medium' && (
        <Box
          sx={{
            border: '2px',
            height: '22px',
            background: getBackgroundColor(),
            display: 'inline-flex',
            flexDirection: 'row',
            borderRadius: 'var(--radius-xs, 2px)',
            padding: '2px 8px',
            gap: '4px',
            ...sx,
          }}
        >
          <BadgeContent icon={icon} iconHeight={'18px'} iconWidth={'18px'} color={getColor()}>
            <BadgeTypography
              sx={{
                fontSize: '14px',
                fontWeight: '520',
                lineHeight: '16px',
                color: getColor(),
              }}
            >
              {text}
            </BadgeTypography>
          </BadgeContent>
        </Box>
      )}
      {size == 'big' && (
        <Box
          sx={{
            border: '4px',
            height: filled ? '24px' : '28px',
            background: getBackgroundColor(),
            display: 'inline-flex',
            flexDirection: 'row',
            borderRadius: 'var(--radius-xs, 2px)',
            gap: filled ? '10px' : '8px',
            padding: filled ? '2px 6px' : '4px 8px',
            ...sx,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '4px' }}>
            <BadgeContent icon={icon} iconHeight={'20px'} iconWidth={'20px'} color={getColor()}>
              <BadgeTypography
                sx={{
                  fontSize: '16px',
                  fontWeight: '420',
                  lineHeight: '20px',
                  color: getColor(),
                }}
              >
                {text}
              </BadgeTypography>
            </BadgeContent>
          </Box>
        </Box>
      )}
    </>
  );
};

CPEBadge.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'big']).isRequired,
  filled: PropTypes.bool,
  text: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['red', 'grey', 'green', 'orange', 'blue']).isRequired,
  icon: PropTypes.element,
  sx: PropTypes.object,
};

export default CPEBadge;
