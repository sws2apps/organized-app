import { SvgIcon, SxProps, Theme, useTheme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconBack = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  const theme = useTheme();
  return (
    <SvgIcon
      className={`organized-icon-back ${className}`}
      sx={{
        width: `${width}px`,
        height: `${height}px`,
        transform: theme.direction === 'rtl' ? 'scaleX(-1)' : 'none',
        ...sx,
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_3114_66176"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3114_66176)">
          <path
            d="M9.99039 17.6448L4.34619 12.0006L9.99039 6.35645L11.0346 7.40065L7.21919 11.2507H19.6538V12.7506H7.20959L11.0596 16.6006L9.99039 17.6448Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconBack;
