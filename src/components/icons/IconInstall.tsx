import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconInstall = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-install ${className}`}
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
          id="mask0_2674_31400"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2674_31400)">
          <path
            d="M5.3077 22.5004C4.80257 22.5004 4.375 22.3254 4.025 21.9754C3.675 21.6254 3.5 21.1979 3.5 20.6927V3.30819C3.5 2.80306 3.675 2.37549 4.025 2.02549C4.375 1.67549 4.80257 1.50049 5.3077 1.50049H12.0385V3.00046H5.3077C5.23077 3.00046 5.16024 3.03251 5.09613 3.09661C5.03202 3.16073 4.99997 3.23126 4.99997 3.30819V4.25049H12.0385V5.75044H4.99997V18.2505H15V16.2505H16.5V20.6927C16.5 21.1979 16.325 21.6254 15.975 21.9754C15.625 22.3254 15.1974 22.5004 14.6922 22.5004L5.3077 22.5004ZM4.99997 19.7505V20.6928C4.99997 20.7697 5.03202 20.8402 5.09613 20.9043C5.16024 20.9684 5.23077 21.0005 5.3077 21.0005H14.6922C14.7692 21.0005 14.8397 20.9684 14.9038 20.9043C14.9679 20.8402 15 20.7697 15 20.6928V19.7505H4.99997ZM16 13.6447L11.3461 8.99084L12.4 7.93704L15.25 10.787V3.25049H16.75V10.787L19.6 7.93704L20.6538 8.99084L16 13.6447Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconInstall;
