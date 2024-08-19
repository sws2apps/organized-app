import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconComputerVideo = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-computer-video ${className}`}
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
          id="mask0_4432_164533"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4432_164533)">
          <path
            d="M15.5042 11.0042L9.21582 15.0427V6.96582L15.5042 11.0042Z"
            fill={color}
          />
          <path
            d="M8.5 20.5004V18.5004H4.3077C3.80257 18.5004 3.375 18.3254 3.025 17.9754C2.675 17.6254 2.5 17.1979 2.5 16.6927V5.30819C2.5 4.80306 2.675 4.37549 3.025 4.02549C3.375 3.67549 3.80257 3.50049 4.3077 3.50049H19.6923C20.1974 3.50049 20.625 3.67549 20.975 4.02549C21.325 4.37549 21.5 4.80306 21.5 5.30819V16.6927C21.5 17.1979 21.325 17.6254 20.975 17.9754C20.625 18.3254 20.1974 18.5004 19.6923 18.5004H15.5V20.5004H8.5ZM4.3077 17.0005H19.6923C19.7692 17.0005 19.8397 16.9684 19.9038 16.9043C19.9679 16.8402 20 16.7697 20 16.6927V5.30819C20 5.23126 19.9679 5.16073 19.9038 5.09661C19.8397 5.03251 19.7692 5.00046 19.6923 5.00046H4.3077C4.23077 5.00046 4.16024 5.03251 4.09613 5.09661C4.03202 5.16073 3.99998 5.23126 3.99998 5.30819V16.6927C3.99998 16.7697 4.03202 16.8402 4.09613 16.9043C4.16024 16.9684 4.23077 17.0005 4.3077 17.0005Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconComputerVideo;
