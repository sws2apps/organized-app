import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconFullscreen = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-fullscreen" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_4944_2980247"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4944_2980247)">
          <path
            d="M3.5 21.0004V16.2889H4.99997V19.5005H8.21153V21.0004H3.5ZM15.798 21.0004V19.5005H19.0096V16.2889H20.5096V21.0004H15.798ZM3.5 8.71201V4.00049H8.21153V5.50046H4.99997V8.71201H3.5ZM19.0096 8.71201V5.50046H15.798V4.00049H20.5096V8.71201H19.0096Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconFullscreen;
