import { Box } from '@mui/material';
import { Typography } from '@components';
import { BadgeContentPropsType, BadgePropsType, BadgeTypographyPropsType } from './index.types';

const BadgeContent = (props: BadgeContentPropsType) => {
  const { icon, iconHeight, iconWidth, children, color } = props;

  if (!icon) {
    return children;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '4px' }}>
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
        }}
      >
        {icon}
      </Box>
      {children}
    </Box>
  );
};

const BadgeTypography = (props: BadgeTypographyPropsType) => {
  const { children, sx } = props;

  return (
    <Typography
      className="label-small-medium"
      sx={{
        display: 'flex',
        alignItems: 'center',
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
};

const CPEBadge = (props: BadgePropsType) => {
  const { icon, size, filled, color, text, sx = {} } = props;

  const getColor = () => {
    if (filled) return `var(--always-white)`;

    if (color === 'grey') {
      return `var(--${color}-400)`;
    } else if (color === 'green') {
      return `var(--${color}-main)`;
    } else {
      if (size === 'big' && color === 'red') {
        return `var(--${color}-main)`;
      } else {
        return `var(--${color}-dark)`;
      }
    }
  };

  const getBackgroundColor = () => {
    if (filled) {
      if (color == 'grey') {
        return `var(--${color}-400)`;
      } else {
        return `var(--${color}-main)`;
      }
    } else {
      if (color == 'grey') {
        return `var(--${color}-150)`;
      } else if (color == 'accent') {
        return `var(--accent-200)`;
      } else {
        return `var(--${color}-secondary)`;
      }
    }
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

export default CPEBadge;
