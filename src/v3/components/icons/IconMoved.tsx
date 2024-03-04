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
          height="24"
        >
          <rect y="0.500488" width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_3201_166967)">
          <path
            d="M9.49997 5.8466C8.99486 5.8466 8.56088 5.66519 8.19805 5.30237C7.83523 4.93954 7.65382 4.50556 7.65382 4.00045C7.65382 3.49533 7.83523 3.06135 8.19805 2.69852C8.56088 2.3357 8.99486 2.1543 9.49997 2.1543C10.0051 2.1543 10.4391 2.3357 10.8019 2.69852C11.1647 3.06135 11.3461 3.49533 11.3461 4.00045C11.3461 4.50556 11.1647 4.93954 10.8019 5.30237C10.4391 5.66519 10.0051 5.8466 9.49997 5.8466ZM3.32693 23.2504L6.09615 8.97735L3.74995 9.96775V13.2504H2.25V8.9543L7.18265 6.92932C7.63265 6.74599 8.07015 6.71233 8.49515 6.82835C8.92015 6.94438 9.25124 7.20303 9.48842 7.6043L10.448 9.1947C10.8916 9.9152 11.4894 10.5085 12.2413 10.9745C12.9932 11.4405 13.8295 11.6928 14.75 11.7312V13.2312C13.6115 13.1927 12.5842 12.8969 11.6682 12.3437C10.7522 11.7905 9.99804 11.0946 9.40573 10.2562L8.6615 14.0158L10.7499 16.0851V23.2504H9.25V17.4139L6.71535 15.0196L4.88842 23.2504H3.32693ZM16.9038 23.3466V9.3466H13.1538V2.6543H21.8461V9.3466H18.0961V23.3466H16.9038ZM18.025 8.25427L20.2788 6.00045L18.025 3.74662L17.1712 4.60045L17.975 5.4043H14.6538V6.5966H17.975L17.1712 7.40045L18.025 8.25427Z"
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default IconMoved;
