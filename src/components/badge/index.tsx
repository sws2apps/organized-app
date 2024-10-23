import { Box } from '@mui/material';
import Typography from '@components/typography';
import {
  BadgeContentPropsType,
  BadgePropsType,
  BadgeTypographyPropsType,
} from './index.types';

/**
 * Component for rendering the content of a badge.
 * @param {BadgeContentPropsType} props - Props for the BadgeContent component.
 * @returns {JSX.Element} BadgeContent component.
 */
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

const BadgeTypography = ({
  children,
  className = 'label-small-medium',
  sx,
}: BadgeTypographyPropsType) => {
  return (
    <Typography
      className={className}
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

const Badge = (props: BadgePropsType) => {
  const {
    icon,
    size,
    filled,
    color,
    text,
    fullWidth,
    centerContent,
    borderStyle,
    className,
    faded,
    sx = {},
  } = props;

  const getColor = () => {
    if (filled) return `var(--always-white)`;

    if (color === 'grey') {
      if (faded) {
        return `var(--${color}-300)`;
      }

      return `var(--${color}-400)`;
    } else if (color === 'green') {
      return `var(--${color}-main)`;
    } else if (color === 'transparent') return 'var(--accent-400)';
    else {
      if (size === 'big' && color === 'red') {
        return `var(--${color}-main)`;
      } else {
        return `var(--${color}-dark)`;
      }
    }
  };

  const getBackgroundColor = () => {
    if (color === 'transparent') return color;
    if (filled) {
      if (color === 'grey') {
        return `var(--${color}-400)`;
      } else {
        return `var(--${color}-main)`;
      }
    } else {
      if (color === 'grey') {
        if (faded) {
          return `var(--${color}-100)`;
        }

        return `var(--${color}-150)`;
      } else if (color === 'accent') {
        return `var(--accent-200)`;
      } else {
        return `var(--${color}-secondary)`;
      }
    }
  };

  return (
    <>
      {size === 'small' && (
        <Box
          sx={{
            border: '2px',
            height: props.multiLine ? 'unset' : '20px',
            background: getBackgroundColor(),
            display: 'flex',
            flexDirection: 'row',
            borderRadius: 'var(--radius-xs)',
            gap: '4px',
            padding: '2px 6px',
            flexShrink: '0',
            width: fullWidth ? '100%' : 'auto',
            justifyContent: centerContent ? 'center' : 'flex-start',
            borderStyle: borderStyle || 'none',
            ...sx,
          }}
        >
          <BadgeContent
            icon={icon}
            iconHeight={'16px'}
            iconWidth={'16px'}
            color={getColor()}
          >
            <BadgeTypography
              className={className}
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
      {size === 'medium' && (
        <Box
          sx={{
            border: '1px',
            borderColor: 'var(--accent-350)',
            height: props.multiLine ? 'unset' : '22px',
            background: getBackgroundColor(),
            display: 'flex',
            flexDirection: 'row',
            borderRadius: 'var(--radius-s)',
            padding: '2px 8px',
            gap: '4px',
            flexShrink: '0',
            width: fullWidth ? '100%' : 'auto',
            justifyContent: centerContent ? 'center' : 'flex-start',
            borderStyle: borderStyle || 'none',
            ...sx,
          }}
        >
          <BadgeContent
            icon={icon}
            iconHeight={'18px'}
            iconWidth={'18px'}
            color={getColor()}
          >
            <BadgeTypography
              className={className}
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
      {size === 'big' && (
        <Box
          sx={{
            border: '4px',
            height: props.multiLine ? 'unset' : filled ? '24px' : '28px',
            background: getBackgroundColor(),
            display: 'flex',
            flexDirection: 'row',
            borderRadius: 'var(--radius-xs)',
            gap: filled ? '10px' : '8px',
            padding: filled ? '2px 6px' : '4px 8px',
            flexShrink: '0',
            width: fullWidth ? '100%' : 'auto',
            justifyContent: centerContent ? 'center' : 'flex-start',
            borderStyle: borderStyle || 'none',
            ...sx,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '4px' }}>
            <BadgeContent
              icon={icon}
              iconHeight={'20px'}
              iconWidth={'20px'}
              color={getColor()}
            >
              <BadgeTypography
                className={className}
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

export default Badge;
