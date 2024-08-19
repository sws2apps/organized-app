import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconHallOverseer = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-hall-overseer ${className}`}
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
          id="mask0_4432_164536"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4432_164536)">
          <path
            d="M12 17.683C13.0346 17.4253 13.8926 16.8294 14.574 15.8954C15.2554 14.9614 15.5961 13.9265 15.5961 12.7907V10.494L12 8.69265L8.40385 10.4929V12.7882C8.40385 13.9283 8.74455 14.9647 9.42595 15.8974C10.1074 16.8301 10.9654 17.4253 12 17.683ZM4.5 20.5003V9.25032L12 3.61572L19.5 9.25032V20.5003H4.5ZM5.99997 19.0003H18V10.0003L12 5.5003L5.99997 10.0003V19.0003Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconHallOverseer;
