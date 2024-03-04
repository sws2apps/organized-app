import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconMicrophone = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-microphone" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_4432_164532"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_4432_164532)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.2982 23.4604L15.6115 11.6528H8.38818L9.70146 23.4604H14.2982ZM12.8657 22.0604H11.1743L10.293 13.156H13.747L12.8657 22.0604Z"
            fill={color}
          />
          <path
            d="M7.38574 6.21442C7.38574 3.92111 9.24484 2.06201 11.5381 2.06201H12.4616C14.7549 2.06201 16.614 3.92111 16.614 6.21442V9.31335C16.614 9.86564 16.1663 10.3134 15.614 10.3134H8.38574C7.83346 10.3134 7.38574 9.86564 7.38574 9.31335V6.21442Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconMicrophone;
