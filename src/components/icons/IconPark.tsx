import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconPark = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-park ${className}`}
      sx={{ width: `${width}px`, height: `${height}px`, ...sx }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_4944_2980563"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2980563)">
          <path
            d="M13.4692 21.5002H10.5308V17.5002H3.94238L7.94238 11.5002H5.96161L12 2.86572L18.0384 11.5002H16.0576L20.0576 17.5002H13.4692V21.5002ZM6.75001 16.0003H10.75H8.85001H15.15H13.25H17.25H6.75001ZM6.75001 16.0003H17.25L13.25 10.0003H15.15L12 5.50027L8.85001 10.0003H10.75L6.75001 16.0003Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconPark;
