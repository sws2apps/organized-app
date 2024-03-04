import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconCustom = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-custom" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_2799_54678"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2799_54678)">
          <path
            d="M2 24.5004V22.5004H22V24.5004H2ZM6.10781 17.2313H6.97742L15.7774 8.4371L15.3404 7.98121L14.902 7.55829L6.10781 16.3583V17.2313ZM5 18.3274V15.8274L16.2192 4.61388C16.3256 4.50746 16.442 4.4299 16.5683 4.38118C16.6946 4.33246 16.8232 4.30811 16.9542 4.30811C17.0852 4.30811 17.2122 4.33246 17.335 4.38118C17.4578 4.4299 17.5744 4.50939 17.6846 4.61965L18.7135 5.65428C18.8237 5.76068 18.9022 5.87583 18.949 5.99973C18.9958 6.12363 19.0192 6.25166 19.0192 6.38381C19.0192 6.50771 18.9949 6.63381 18.9461 6.76213C18.8974 6.89045 18.8198 7.00771 18.7135 7.11391L7.5 18.3274H5ZM15.7774 8.4371L15.3404 7.98121L14.902 7.55829L15.7774 8.4371Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconCustom;
