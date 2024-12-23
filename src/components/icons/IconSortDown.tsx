import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconSortDown = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-sort-down ${className}`}
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
          d="M4.78833 6V15.9312L5.8972 14.8189L7 15.9427L4 19L1 15.9427L2.1028 14.8189L3.21167 15.9312V6H4.78833Z"
          fill={color}
        />
        <path
          d="M9 8V6H13.3333V8H9ZM9 13V11H17.6667V13H9ZM9 18V16H22V18H9Z"
          fill={color}
        />
      </svg>
    </SvgIcon>
  );
};

export default IconSortDown;
