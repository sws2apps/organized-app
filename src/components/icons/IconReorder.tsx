import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconReorder = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-reorder ${className}`}
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
          d="M16.3784 12.7685H20.0753L17.9645 14.9045L19.0471 16L23 12L19.0471 8L17.9645 9.09554L20.0753 11.2315H16.3784V12.7685Z"
          fill={color}
        />
        <path
          d="M8.73553 12.7685L4.94024 12.7685L7.05107 14.8887L5.95285 16L2 12L5.95285 8L7.03548 9.09554L4.92467 11.2315L8.73553 11.2315V12.7685Z"
          fill={color}
        />
        <path
          d="M14.5244 12C14.5244 13.1318 13.6177 14.0493 12.4993 14.0493C11.3808 14.0493 10.4742 13.1318 10.4742 12C10.4742 10.8682 11.3808 9.95073 12.4993 9.95073C13.6177 9.95073 14.5244 10.8682 14.5244 12Z"
          fill={color}
        />
      </svg>
    </SvgIcon>
  );
};

export default IconReorder;
