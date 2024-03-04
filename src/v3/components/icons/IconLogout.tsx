import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconLogout = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-logout" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2704_32873"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2704_32873)">
          <path
            d="M5.3077 21.0004C4.80257 21.0004 4.375 20.8254 4.025 20.4754C3.675 20.1254 3.5 19.6979 3.5 19.1927V5.80819C3.5 5.30306 3.675 4.87549 4.025 4.52549C4.375 4.17549 4.80257 4.00049 5.3077 4.00049H12.0096V5.50046H5.3077C5.23077 5.50046 5.16024 5.53251 5.09612 5.59661C5.03202 5.66073 4.99997 5.73126 4.99997 5.80819V19.1927C4.99997 19.2697 5.03202 19.3402 5.09612 19.4043C5.16024 19.4684 5.23077 19.5005 5.3077 19.5005H12.0096V21.0004H5.3077ZM16.2308 16.7696L15.1923 15.6851L17.6269 13.2504H9.09613V11.7505H17.6269L15.1923 9.31587L16.2308 8.23129L20.5 12.5005L16.2308 16.7696Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconLogout;
