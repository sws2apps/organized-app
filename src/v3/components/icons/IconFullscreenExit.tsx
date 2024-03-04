import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconFullscreenExit = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-fullscreen-exit" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_4944_2980254"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2980254)">
          <path
            d="M6.71157 21.0004V17.7889H3.5V16.2889H8.21153V21.0004H6.71157ZM15.798 21.0004V16.2889H20.5096V17.7889H17.298V21.0004H15.798ZM3.5 8.71201V7.21206H6.71157V4.00049H8.21153V8.71201H3.5ZM15.798 8.71201V4.00049H17.298V7.21206H20.5096V8.71201H15.798Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconFullscreenExit;
