import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconCongregationBorder = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-congregation-border ${className}`}
      sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 3.2L20.4 9.3L17.2 19.2H6.8L3.6 9.3L12 3.2Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeDasharray="2.6 2.2"
        />
        <circle cx="12" cy="3.2" r="1.6" fill={color} />
        <circle cx="20.4" cy="9.3" r="1.6" fill={color} />
        <circle cx="17.2" cy="19.2" r="1.6" fill={color} />
        <circle cx="6.8" cy="19.2" r="1.6" fill={color} />
        <circle cx="3.6" cy="9.3" r="1.6" fill={color} />
      </svg>
    </SvgIcon>
  );
};

export default IconCongregationBorder;
