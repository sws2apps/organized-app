import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconPin = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-pin ${className}`}
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
          id="mask0_3885_132119"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3885_132119)">
          <path
            d="M13.8245 14.7332L13.8921 17.2615L12.8602 18.3501L9.56636 15.228L5.78278 19.2198L4.72252 19.2482L4.69415 18.1879L8.47773 14.1962L5.18384 11.074L6.21572 9.98539L8.74405 9.91769L13.7051 4.68371L12.9793 3.99578L14.0112 2.90713L20.5431 9.09846L19.5113 10.1871L18.7855 9.49918L13.8245 14.7332ZM7.76772 11.4565L12.3401 15.7904L12.2966 14.1647L17.6968 8.4673L14.7937 5.71558L9.39349 11.4129L7.76772 11.4565Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconPin;
