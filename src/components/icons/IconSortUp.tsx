import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconSortUp = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-sort-up ${className}`}
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
          d="M3.21167 18V8.06875L2.1028 9.18113L1 8.05728L4 5L7 8.05728L5.8972 9.18113L4.78833 8.06875V18H3.21167Z"
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

export default IconSortUp;
