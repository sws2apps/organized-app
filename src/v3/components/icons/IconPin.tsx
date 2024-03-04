import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconPin = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-pin" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3885_132119"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3885_132119)">
          <path
            d="M13.8245 15.2332L13.8921 17.7615L12.8602 18.8501L9.56636 15.728L5.78278 19.7198L4.72252 19.7482L4.69415 18.6879L8.47773 14.6962L5.18384 11.574L6.21572 10.4854L8.74405 10.4177L13.7051 5.18371L12.9793 4.49578L14.0112 3.40713L20.5431 9.59846L19.5113 10.6871L18.7855 9.99918L13.8245 15.2332ZM7.76772 11.9565L12.3401 16.2904L12.2966 14.6647L17.6968 8.9673L14.7937 6.21558L9.39349 11.9129L7.76772 11.9565Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconPin;
