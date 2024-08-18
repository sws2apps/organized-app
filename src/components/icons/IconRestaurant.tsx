import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconRestaurant = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-restaurant ${className}`}
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
          id="mask0_4944_2980559"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2980559)">
          <path
            d="M7.24986 21.7505V12.6581C6.43833 12.4825 5.75468 12.0719 5.19891 11.4264C4.64313 10.7809 4.36523 10.0107 4.36523 9.11586V2.25049H5.86521V9.11586H7.24986V2.25049H8.74981V9.11586H10.1345V2.25049H11.6344V9.11586C11.6344 10.0107 11.3565 10.7809 10.8008 11.4264C10.245 12.0719 9.56134 12.4825 8.74981 12.6581V21.7504L7.24986 21.7505ZM16.8652 21.7505V13.7504H14.1345V7.00046C14.1345 5.75176 14.5354 4.66876 15.3373 3.75144C16.1392 2.83414 17.1485 2.34023 18.3652 2.26971V21.7505H16.8652Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconRestaurant;
