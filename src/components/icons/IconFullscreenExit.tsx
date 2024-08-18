import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

const IconFullscreenExit = ({
  color = '#222222',
  width = 24,
  height = 24,
  sx = {},
  className,
}: IconProps) => {
  return (
    <SvgIcon
      className={`organized-icon-fullscreen-exit ${className}`}
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
          id="mask0_4944_2980254"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2980254)">
          <path
            d="M6.71157 20.5004V17.2889H3.5V15.7889H8.21153V20.5004H6.71157ZM15.798 20.5004V15.7889H20.5096V17.2889H17.298V20.5004H15.798ZM3.5 8.21201V6.71206H6.71157V3.50049H8.21153V8.21201H3.5ZM15.798 8.21201V3.50049H17.298V6.71206H20.5096V8.21201H15.798Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconFullscreenExit;
