import { Box } from '@mui/material';
import Typography from '@components/typography';
import { CustomClassName } from '@definition/app';
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
  className = 'body-small-semibold',
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

type ColorProps = Pick<BadgePropsType, 'color' | 'filled' | 'faded' | 'size'> &
  Pick<BadgePropsType, 'light'>;

const resolveTextColor = ({ color, filled, faded, size }: ColorProps) => {
  if (filled) return 'var(--always-white)';
  if (color === 'transparent') return 'var(--accent-400)';
  if (color === 'grey') return faded ? 'var(--grey-300)' : 'var(--grey-400)';
  if (color === 'green') return 'var(--green-main)';
  if (color === 'red' && size === 'big') return 'var(--red-main)';

  return `var(--${color}-dark)`;
};

const resolveBackgroundColor = ({ color, filled, faded, light }: ColorProps) => {
  if (color === 'transparent') return 'transparent';
  if (filled) {
    return color === 'grey' ? 'var(--grey-400)' : `var(--${color}-main)`;
  }
  if (light) {
    return color === 'accent' || color === 'grey'
      ? `var(--${color}-150)`
      : `var(--${color}-secondary)`;
  }
  if (color === 'grey') return faded ? 'var(--grey-100)' : 'var(--grey-150)';
  if (color === 'accent') return 'var(--accent-200)';

  return `var(--${color}-secondary)`;
};

const bigBadgeHeight = (multiLine?: boolean, filled?: boolean) => {
  if (multiLine) return 'unset';
  return filled ? '24px' : '28px';
};

const sizeClassName: Record<BadgePropsType['size'], CustomClassName> = {
  small: 'label-small-medium',
  medium: 'body-small-semibold',
  big: 'body-regular',
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
    light,
    sx = {},
  } = props;

  const textClassName = className ?? sizeClassName[size];

  const colorProps = { color, filled, faded, size, light };
  const textColor = resolveTextColor(colorProps);
  const backgroundColor = resolveBackgroundColor(colorProps);

  return (
    <>
      {size === 'small' && (
        <Box
          sx={{
            border: '2px',
            height: props.multiLine ? 'unset' : '20px',
            background: backgroundColor,
            display: 'flex',
            flexDirection: 'row',
            borderRadius: 'var(--radius-s)',
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
            color={textColor}
          >
            <BadgeTypography
              className={textClassName}
              sx={{ lineHeight: '16px', color: textColor }}
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
            background: backgroundColor,
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
            color={textColor}
          >
            <BadgeTypography
              className={textClassName}
              sx={{ lineHeight: '16px', color: textColor }}
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
            height: bigBadgeHeight(props.multiLine, filled),
            background: backgroundColor,
            display: 'flex',
            flexDirection: 'row',
            borderRadius: 'var(--radius-s)',
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
              color={textColor}
            >
              <BadgeTypography
                className={textClassName}
                sx={{
                  lineHeight: '20px',
                  color: textColor,
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
