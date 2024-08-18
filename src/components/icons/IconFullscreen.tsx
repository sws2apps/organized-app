import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconFullscreen = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-fullscreen ${className}`}
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
          id="mask0_4944_2980247"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2980247)">
          <path
            d="M3.5 20.5004V15.7889H4.99997V19.0005H8.21153V20.5004H3.5ZM15.798 20.5004V19.0005H19.0096V15.7889H20.5096V20.5004H15.798ZM3.5 8.21201V3.50049H8.21153V5.00046H4.99997V8.21201H3.5ZM19.0096 8.21201V5.00046H15.798V3.50049H20.5096V8.21201H19.0096Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconFullscreen;
