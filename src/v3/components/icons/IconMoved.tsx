import { SvgIcon, SxProps, Theme } from '@mui/material';

type IconProps = {
  color?: string;
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
};

const IconMoved = ({ color = '#222222', width = 24, height = 24, sx = {} }: IconProps) => {
  return (
    <SvgIcon id="organized-icon-moved" sx={{ width: `${width}px`, height: `${height}px`, ...sx }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_3201_166967"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="25"
        >
          <rect y="0.000488281" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3201_166967)">
          <path
            d="M9.49997 5.3466C8.99486 5.3466 8.56088 5.16519 8.19805 4.80237C7.83523 4.43954 7.65382 4.00556 7.65382 3.50045C7.65382 2.99533 7.83523 2.56135 8.19805 2.19852C8.56088 1.8357 8.99486 1.6543 9.49997 1.6543C10.0051 1.6543 10.4391 1.8357 10.8019 2.19852C11.1647 2.56135 11.3461 2.99533 11.3461 3.50045C11.3461 4.00556 11.1647 4.43954 10.8019 4.80237C10.4391 5.16519 10.0051 5.3466 9.49997 5.3466ZM3.32693 22.7504L6.09615 8.47735L3.74995 9.46775V12.7504H2.25V8.4543L7.18265 6.42932C7.63265 6.24599 8.07015 6.21233 8.49515 6.32835C8.92015 6.44438 9.25124 6.70303 9.48842 7.1043L10.448 8.6947C10.8916 9.4152 11.4894 10.0085 12.2413 10.4745C12.9932 10.9405 13.8295 11.1928 14.75 11.2312V12.7312C13.6115 12.6927 12.5842 12.3969 11.6682 11.8437C10.7522 11.2905 9.99804 10.5946 9.40573 9.75617L8.6615 13.5158L10.7499 15.5851V22.7504H9.25V16.9139L6.71535 14.5196L4.88842 22.7504H3.32693ZM16.9038 22.8466V8.8466H13.1538V2.1543H21.8461V8.8466H18.0961V22.8466H16.9038ZM18.025 7.75427L20.2788 5.50045L18.025 3.24662L17.1712 4.10045L17.975 4.9043H14.6538V6.0966H17.975L17.1712 6.90045L18.025 7.75427Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconMoved;
