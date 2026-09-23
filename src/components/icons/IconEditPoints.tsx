import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconEditPoints = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-edit-points ${className}`}
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
          d="M6.2 16.9L10.1 7.6M13.4 6.4L17.6 16.4M16.5 18.5H7.5"
          stroke={color}
          strokeWidth="1.5"
        />
        <rect
          x="9.5"
          y="2.5"
          width="5"
          height="5"
          rx="1"
          stroke={color}
          strokeWidth="1.5"
        />
        <rect
          x="2.5"
          y="16"
          width="5"
          height="5"
          rx="1"
          stroke={color}
          strokeWidth="1.5"
        />
        <rect
          x="16.5"
          y="16"
          width="5"
          height="5"
          rx="1"
          fill={color}
          stroke={color}
          strokeWidth="1.5"
        />
      </svg>
    </SvgIcon>
  );
};

export default IconEditPoints;
